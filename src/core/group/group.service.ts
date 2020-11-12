import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupMembershipStatus } from './enums/group-membership-status.enum';
import { UpdateGroupDto } from './dto/update-group.dto';

export class _BaseGroupException extends Error {}

export class GroupDoesNotExistError extends _BaseGroupException {}
export class NotGroupAdminError extends _BaseGroupException {}
export class BannedFromGroupError extends _BaseGroupException {}
export class NotInvitedToGroupError extends _BaseGroupException {}
export class NotGroupMemberError extends _BaseGroupException {}
export class CannotDeleteGroupError extends _BaseGroupException {}
export class CannotLeaveGroupError extends _BaseGroupException {}
export class CannotBanError extends _BaseGroupException {}
export class CannotKickError extends _BaseGroupException {}

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  /**
   * Create a group
   * @param creatorId
   * @param groupName
   * @param inviteOnly
   */
  async create(
    creatorId: string,
    groupName: string,
    inviteOnly = false,
  ): Promise<Group> {
    const group = new Group();
    group.name = groupName;
    group.inviteOnly = inviteOnly;
    const savedGroup = await this.groupRepository.save(group);

    const groupMember = new GroupMember();
    groupMember.group = savedGroup;
    groupMember.memberId = creatorId;
    groupMember.membershipStatus = GroupMembershipStatus.Admin;
    await this.groupMemberRepository.save(groupMember);
    return savedGroup;
  }

  /**
   * Find a group and return group info if exists
   * @param groupId
   * @throws GroupDoesNotExistError
   */
  async findOne(groupId: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ id: groupId });
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }
    return group;
  }

  /**
   * Find groups, optionally filter by name and invite only properies
   * @param options
   */
  async findMany(options: {
    name?: string;
    inviteOnly?: boolean;
  }): Promise<[Group[], number]> {
    return this.groupRepository.findAndCount({
      where: {
        // falsy conditions should be discarded
        ...(options.name && { name: ILike(`%${options.name}%`) }),
        // falsy values will cause errors
        ...(options.inviteOnly != null && { inviteOnly: options.inviteOnly }),
      },
    });
  }

  /**
   * Update group
   * @param groupId
   * @param actingUserId
   * @param updateGroupDto
   * @throws GroupDoesNotExistError
   * @throws NotGroupMemberError
   * @throws NotGroupAdminError
   */
  async update(
    groupId: string,
    actingUserId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const group = await this.groupRepository.findOne({ id: groupId });
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }

    const groupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });
    if (groupMember == null) {
      throw new NotGroupMemberError(
        `Acting user "${actingUserId}" is not a member of group "${groupId}"`,
      );
    }
    if (groupMember?.membershipStatus !== GroupMembershipStatus.Admin) {
      throw new NotGroupAdminError(
        `Acting user "${actingUserId}" is not an admin of group "${groupId}"`,
      );
    }

    group.name = updateGroupDto.name ?? group.name;
    group.inviteOnly = updateGroupDto.inviteOnly ?? group.inviteOnly;
    return this.groupRepository.save(group);
  }

  /**
   * Delete group
   * @param groupId
   * @param actingUserId
   * @throws GroupDoesNotExistError
   * @throws NotGroupMemberError
   * @throws NotGroupAdminError
   * @throws CannotDeleteGroupError
   */
  async delete(groupId: string, actingUserId: string): Promise<void> {
    const group = await this.groupRepository.findOne(groupId);
    if (group == null) {
      throw new GroupDoesNotExistError(
        `User "${actingUserId}" cannot delete non existing group ${groupId}`,
      );
    }
    const groupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });
    if (groupMember?.membershipStatus !== GroupMembershipStatus.Admin) {
      throw new NotGroupAdminError(
        `User "${actingUserId}" is not an admin of group "${groupId}"`,
      );
    }
    const adminCount = await this.groupMemberRepository.count({
      groupId: groupId,
      membershipStatus: GroupMembershipStatus.Admin,
    });
    if (adminCount === 1) {
      throw new CannotDeleteGroupError(
        `Acting user "${actingUserId}" cannot delete group "${groupId}" with the presence of other admins`,
      );
    }
    await this.groupRepository.delete({ id: groupId });
  }

  /**
   * Invite user to group
   * @param groupId
   * @param actingUserId
   * @param targetUserId
   * @throws GroupDoesNotExistError
   * @throws NotGroupMemberError
   * @throws NotGroupAdminError
   */
  async invite(
    groupId: string,
    actingUserId: string,
    targetUserId: string,
  ): Promise<GroupMember> {
    const group = await this.groupRepository.findOne(groupId);
    if (group == null) {
      throw new GroupDoesNotExistError(
        `User "${targetUserId}" cannot be invited to non existing group ${groupId}`,
      );
    }

    // check if the acting member is an admin
    const actingGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });
    if (actingGroupMember == null) {
      throw new NotGroupMemberError(
        `Acting user "${actingUserId}" is not a member of group "${groupId}"`,
      );
    }
    if (actingGroupMember.membershipStatus !== GroupMembershipStatus.Admin) {
      throw new NotGroupAdminError(
        `Acting user "${actingUserId}" is not an admin of group "${groupId}"`,
      );
    }

    const targetGroupMember = await this.groupMemberRepository.findOne(
      targetUserId,
    );
    if (targetGroupMember?.membershipStatus === GroupMembershipStatus.Banned) {
      throw new BannedFromGroupError(
        `Invited user "${targetUserId}" is banned from group "${groupId}", unban first to invite`,
      );
    }
    if (
      targetGroupMember?.membershipStatus === GroupMembershipStatus.Admin ||
      targetGroupMember?.membershipStatus === GroupMembershipStatus.Member ||
      targetGroupMember?.membershipStatus === GroupMembershipStatus.Invited
    ) {
      // invited user already a member or previously invited
      return targetGroupMember;
    }

    const newMember = new GroupMember();
    newMember.groupId = groupId;
    newMember.memberId = targetUserId;
    newMember.membershipStatus = GroupMembershipStatus.Invited;

    return this.groupMemberRepository.save(newMember);
  }

  /**
   * Find groups of user
   * @param userId
   */
  async findMembershipsOfUser(userId: string): Promise<GroupMember[]> {
    return this.groupMemberRepository.find({
      where: { memberId: userId },
      relations: ['group'],
    });
  }

  /**
   * Join a group
   * @param groupId
   * @param actingUserId
   */
  async join(groupId: string, actingUserId: string): Promise<GroupMember> {
    const group = await this.groupRepository.findOne({ id: groupId });
    if (!group) {
      throw new GroupDoesNotExistError(
        `User "${actingUserId}" cannot join non existing group ${groupId}`,
      );
    }

    const actingGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });

    // banned
    if (actingGroupMember?.membershipStatus === GroupMembershipStatus.Banned) {
      throw new BannedFromGroupError(
        `User "${actingUserId}" is banned from group "${groupId}"`,
      );
    }
    // already a member
    if (
      actingGroupMember?.membershipStatus === GroupMembershipStatus.Admin ||
      actingGroupMember?.membershipStatus === GroupMembershipStatus.Member
    ) {
      return actingGroupMember;
    }
    // trying to join an invite only server
    if (group.inviteOnly) {
      if (
        actingGroupMember?.membershipStatus === GroupMembershipStatus.Invited
      ) {
        // has invite
        actingGroupMember.membershipStatus = GroupMembershipStatus.Member;
        // save and return;
        return this.groupMemberRepository.save(actingGroupMember);
      } else {
        // no invitation
        throw new NotInvitedToGroupError(
          `User "${actingUserId}" was not invited to group "${groupId}"`,
        );
      }
    }

    const newMember = new GroupMember();
    newMember.groupId = groupId;
    newMember.memberId = actingUserId;
    newMember.membershipStatus = GroupMembershipStatus.Member;
    return this.groupMemberRepository.save(newMember);
  }

  /**
   * Get member status
   * @param groupId
   * @param memberId
   */
  async getMember(groupId: string, memberId: string): Promise<GroupMember> {
    const group = await this.groupRepository.findOne(groupId);
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }
    return this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: memberId,
    });
  }

  // read group members
  async getMembers(groupId: string): Promise<[GroupMember[], number]> {
    const group = await this.groupRepository.findOne(groupId, {
      relations: ['members'],
    });
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }
    return [group.members, group.members.length];
  }

  /**
   * Leave a group
   * @param groupId
   * @param actingUserId
   */
  async leave(groupId: string, actingUserId: string) {
    const group = await this.groupRepository.findOne(groupId, {
      relations: ['members'],
    });
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }

    const actingGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });

    if (actingGroupMember == null) {
      throw new NotGroupMemberError(
        `Acting user "${actingUserId}" is not a member of group "${groupId}"`,
      );
    }
    if (actingGroupMember.membershipStatus == GroupMembershipStatus.Banned) {
      throw new BannedFromGroupError(
        `Acting user "${actingUserId}" is not banned from group "${groupId}"`,
      );
    }

    if (actingGroupMember.membershipStatus === GroupMembershipStatus.Admin) {
      const currentAdminCount = await this.groupMemberRepository.count({
        groupId: groupId,
        membershipStatus: GroupMembershipStatus.Admin,
      });
      // last member as admin
      if (currentAdminCount === 1) {
        throw new CannotLeaveGroupError(
          `Acting user "${actingUserId}" cannot leave group "${groupId}" as the last admin, should either assign someone else as admin and leave or delete the group`,
        );
      }
    }

    await this.groupMemberRepository.remove(actingGroupMember);
  }

  /**
   * Ban user from group
   * @param groupId
   * @param actingUserId
   * @param targetUserId
   * @throws GroupDoesNotExistError
   * @throws NotGroupAdminError
   * @throws CannotBanError
   */
  async ban(
    groupId: string,
    actingUserId: string,
    targetUserId: string,
  ): Promise<GroupMember> {
    const group = await this.groupRepository.findOne(groupId);
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }

    const actingGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });
    if (actingGroupMember?.membershipStatus !== GroupMembershipStatus.Admin) {
      throw new NotGroupAdminError(
        `Acting user "${actingUserId}" is not an admin of group "${groupId}"`,
      );
    }

    const targetGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: targetUserId,
    });
    if (targetGroupMember?.membershipStatus === GroupMembershipStatus.Admin) {
      throw new CannotBanError(
        `User to ban "${targetUserId}" is an admin in group "${groupId}"`,
      );
    }
    if (targetGroupMember?.membershipStatus === GroupMembershipStatus.Banned) {
      return targetGroupMember;
    }
    if (targetGroupMember == null) {
      const newBan = new GroupMember();
      newBan.groupId = groupId;
      newBan.memberId = targetUserId;
      newBan.membershipStatus = GroupMembershipStatus.Banned;
      return this.groupMemberRepository.save(newBan);
    }

    targetGroupMember.membershipStatus = GroupMembershipStatus.Banned;
    return this.groupMemberRepository.save(targetGroupMember);
  }

  /**
   * Unban, kick or remove invitation of user from group
   * @param groupId
   * @param actingUserId
   * @param targetUserId
   * @throws GroupDoesNotExistError
   * @throws NotGroupAdminError
   * @throws CannotKickError
   */
  async removeMember(
    groupId: string,
    actingUserId: string,
    targetUserId: string,
  ): Promise<void> {
    const group = await this.groupRepository.findOne(groupId);
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }

    const actingGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });
    if (actingGroupMember?.membershipStatus !== GroupMembershipStatus.Admin) {
      throw new NotGroupAdminError(
        `Acting user "${actingUserId}" is not an admin of group "${groupId}"`,
      );
    }

    const targetGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: targetUserId,
    });
    if (targetGroupMember?.membershipStatus === GroupMembershipStatus.Admin) {
      throw new CannotKickError(
        `Target user "${actingUserId}" is an admin of group "${groupId}"`,
      );
    }
    if (targetGroupMember == null) {
      return;
    }
    await this.groupMemberRepository.remove(targetGroupMember);
  }

  async promoteToAdmin(
    groupId: string,
    actingUserId: string,
    targetUserId: string,
  ): Promise<GroupMember> {
    const group = await this.groupRepository.findOne(groupId);
    if (group == null) {
      throw new GroupDoesNotExistError(`Group "${groupId}" does not exist`);
    }

    const actingGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: actingUserId,
    });
    if (actingGroupMember?.membershipStatus !== GroupMembershipStatus.Admin) {
      throw new NotGroupAdminError(
        `Acting user "${actingUserId}" is not an admin of group "${groupId}"`,
      );
    }

    const targetGroupMember = await this.groupMemberRepository.findOne({
      groupId: groupId,
      memberId: targetUserId,
    });
    if (targetGroupMember == null) {
      throw new NotGroupMemberError(
        `Target user "${targetUserId}" is not a member of group "${groupId}"`,
      );
    }
    targetGroupMember.membershipStatus = GroupMembershipStatus.Admin;
    return this.groupMemberRepository.save(targetGroupMember);
  }
}

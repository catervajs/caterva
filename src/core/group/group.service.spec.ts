import { Test, TestingModule } from '@nestjs/testing';
import {
  BannedFromGroupError,
  CannotBanError,
  CannotDeleteGroupError,
  CannotKickError,
  CannotLeaveGroupError,
  GroupDoesNotExistError,
  GroupService,
  NotGroupAdminError,
  NotGroupMemberError,
  NotInvitedToGroupError,
} from './group.service';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupMembershipStatus } from './enums/group-membership-status.enum';
import exp from 'constants';

describe('GroupService', () => {
  let service: GroupService;
  let groupRepo: Repository<Group>;
  let groupMemberRepo: Repository<GroupMember>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(GroupMember),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepo = module.get<Repository<Group>>(getRepositoryToken(Group));
    groupMemberRepo = module.get<Repository<GroupMember>>(
      getRepositoryToken(GroupMember),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating group', () => {
    it('should return created group', async () => {
      const shouldSaveGroup: Group = {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'group1',
        inviteOnly: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        members: undefined,
      };
      const shouldSaveGroupMember: GroupMember = {
        groupId: '00000000-0000-0000-0000-000000000000',
        memberId: '00000000-0000-0000-0000-000000000000',
        membershipStatus: GroupMembershipStatus.Admin,
        group: undefined,
        member: undefined,
      };
      jest.spyOn(groupRepo, 'save').mockResolvedValueOnce(shouldSaveGroup);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(shouldSaveGroupMember);
      const returnedGroup = await service.create(
        '00000000-0000-0000-0000-000000000000',
        'group1',
      );
      expect(returnedGroup).toEqual(shouldSaveGroup);
    });
  });

  describe('when finding a group', () => {
    it('should return found group', async () => {
      const shouldFindGroup: Group = {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'group1',
        inviteOnly: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        members: undefined,
      };
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(shouldFindGroup);
    });
    describe('if group does not exist', () => {
      it('should throw exception', async () => {
        jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
        await expect(
          service.findOne('00000000-0000-0000-0000-000000000000'),
        ).rejects.toThrow(GroupDoesNotExistError);
      });
    });
  });

  describe('when finding multiple groups', () => {
    const groupsList: Group[] = [
      {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'aa',
        inviteOnly: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        members: undefined,
      },
      {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'bb',
        inviteOnly: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        members: undefined,
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'aaa',
        inviteOnly: true,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        members: undefined,
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'bbb',
        inviteOnly: true,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        members: undefined,
      },
    ];
    describe('without any options', () => {
      it('should return all groups', async () => {
        jest
          .spyOn(groupRepo, 'findAndCount')
          .mockResolvedValueOnce([groupsList, groupsList.length]);
        expect(await service.findMany({})).toEqual([
          groupsList,
          groupsList.length,
        ]);
      });
    });
  });

  describe('when updating group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.update(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          { name: 'group1New' },
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if member does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.update(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          { name: 'group1New' },
        ),
      ).rejects.toThrow(NotGroupMemberError);
    });
    it('should throw if acting member is not admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      await expect(
        service.update(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          { name: 'group1New' },
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should update', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember);
      jest
        .spyOn(groupRepo, 'save')
        .mockResolvedValueOnce({ ...group, name: 'group1New' });
      expect(
        await service.update(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          { name: 'group1New' },
        ),
      ).toEqual({
        ...group,
        name: 'group1New',
      });
    });
  });

  describe('when deleting group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.delete(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if acting member is not admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      await expect(
        service.delete(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting user is the last admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember);
      jest.spyOn(groupMemberRepo, 'count').mockResolvedValueOnce(1);
      await expect(
        service.delete(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(CannotDeleteGroupError);
    });
  });

  describe('when inviting user', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const targetNormalMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Member,
    };
    const targetAdminMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const targetInvitedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const targetBannedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Banned,
    };
    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if acting member does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupMemberError);
    });
    it('should throw if acting member is not admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      await expect(
        service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if target member is banned', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetBannedMember);
      await expect(
        service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(BannedFromGroupError);
    });
    it('should save and return new member invitation', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetInvitedMember);
      expect(
        await service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetInvitedMember);
    });
    it('should return existing member invitation', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetInvitedMember);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetInvitedMember);
      expect(
        await service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetInvitedMember);
    });
    it('should return existing normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetNormalMember);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetNormalMember);
      expect(
        await service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetNormalMember);
    });
    it('should return existing admin member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetAdminMember);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetAdminMember);
      expect(
        await service.invite(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetAdminMember);
    });
  });

  describe('when joining group', () => {
    const publicGroup: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const inviteOnlyGroup: Group = {
      ...publicGroup,
      inviteOnly: true,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const actingBannedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Banned,
    };
    const actingInvitedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Invited,
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.join(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if acting user is banned', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(publicGroup);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingBannedMember);
      await expect(
        service.join(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(BannedFromGroupError);
    });
    it('should return if existing normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(publicGroup);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      expect(
        await service.join(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toEqual(actingNormalMember);
    });
    it('should return if existing admin member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(publicGroup);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember);
      expect(
        await service.join(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toEqual(actingAdminMember);
    });
    describe('if group is public', () => {
      beforeEach(() => {
        jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(publicGroup);
      });
      it('should assign and return as normal member for already invited member', async () => {
        jest
          .spyOn(groupMemberRepo, 'findOne')
          .mockResolvedValueOnce(actingInvitedMember);
        jest
          .spyOn(groupMemberRepo, 'save')
          .mockResolvedValueOnce(actingNormalMember);
        expect(
          await service.join(
            '00000000-0000-0000-0000-000000000000',
            '00000000-0000-0000-0000-000000000000',
          ),
        ).toEqual(actingNormalMember);
      });
      it('should save and return as normal member for new member', async () => {
        jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
        jest
          .spyOn(groupMemberRepo, 'save')
          .mockResolvedValueOnce(actingNormalMember);
        expect(
          await service.join(
            '00000000-0000-0000-0000-000000000000',
            '00000000-0000-0000-0000-000000000000',
          ),
        ).toEqual(actingNormalMember);
      });
    });
    describe('if group is invite only', () => {
      beforeEach(() => {
        jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(inviteOnlyGroup);
      });
      it('should assign and return as normal member for already invited member', async () => {
        jest
          .spyOn(groupMemberRepo, 'findOne')
          .mockResolvedValueOnce(actingInvitedMember);
        jest
          .spyOn(groupMemberRepo, 'save')
          .mockResolvedValueOnce(actingNormalMember);
        expect(
          await service.join(
            '00000000-0000-0000-0000-000000000000',
            '00000000-0000-0000-0000-000000000000',
          ),
        ).toEqual(actingNormalMember);
      });
      it('should throw for not invited member', async () => {
        jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
        await expect(
          service.join(
            '00000000-0000-0000-0000-000000000000',
            '00000000-0000-0000-0000-000000000000',
          ),
        ).rejects.toThrow(NotInvitedToGroupError);
      });
    });
  });

  describe('when getting member of group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const member: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.getMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should return undefined if member does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      expect(
        await service.getMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toBe(undefined);
    });
    it('should return member if exists', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(member);
      expect(
        await service.getMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toEqual(member);
    });
  });

  describe('when getting all members of group', () => {
    const _member: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: [
        { ..._member, memberId: '00000000-0000-0000-0000-000000000000' },
        { ..._member, memberId: '00000000-0000-0000-0000-000000000001' },
        { ..._member, memberId: '00000000-0000-0000-0000-000000000002' },
        { ..._member, memberId: '00000000-0000-0000-0000-000000000003' },
      ],
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.getMembers('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    // this should be impossible but still testing for convenience
    it('should return group with count', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      expect(
        await service.getMembers('00000000-0000-0000-0000-000000000000'),
      ).toEqual([group.members, group.members.length]);
    });
  });

  describe('when leaving group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const actingInvitedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const actingBannedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Banned,
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if acting user is not a member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(NotGroupMemberError);
    });
    it('should throw if acting user is banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingBannedMember);
      await expect(
        service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(BannedFromGroupError);
    });
    it('should throw if acting user is the last admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember);
      jest.spyOn(groupMemberRepo, 'count').mockResolvedValueOnce(1);
      await expect(
        service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).rejects.toThrow(CannotLeaveGroupError);
    });
    it('should return if acting admin is not the last admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember);
      jest.spyOn(groupMemberRepo, 'count').mockResolvedValueOnce(5);
      jest.spyOn(groupMemberRepo, 'remove').mockResolvedValueOnce(undefined);
      expect(
        await service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toBeUndefined();
    });
    it('should leave and return if acting user is normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      jest.spyOn(groupMemberRepo, 'remove').mockResolvedValueOnce(undefined);
      expect(
        await service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toBeUndefined();
    });
    it('should discard invitation and return if acting user is invited member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingInvitedMember);
      jest.spyOn(groupMemberRepo, 'remove').mockResolvedValueOnce(undefined);
      expect(
        await service.leave(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
        ),
      ).toBeUndefined();
    });
  });

  describe('when banning member from group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const actingInvitedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const actingBannedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Banned,
    };
    const targetNormalMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Member,
    };
    const targetAdminMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const targetInvitedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const targetBannedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Banned,
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if acting user is not a member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but invited member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingInvitedMember);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingBannedMember);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingBannedMember);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if target member is admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetAdminMember);
      await expect(
        service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(CannotBanError);
    });
    it('should return banned member if already banned', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetBannedMember);
      expect(
        await service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetBannedMember);
    });
    it('should create and return banned member if not currently a member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetBannedMember);
      expect(
        await service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetBannedMember);
    });
    it('should update as banned and return if currently a normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetNormalMember);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetBannedMember);
      expect(
        await service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetBannedMember);
    });
    it('should update as banned and return if currently a invited member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetInvitedMember);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetBannedMember);
      expect(
        await service.ban(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetBannedMember);
    });
  });

  describe('when removing member from group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const actingInvitedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const actingBannedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Banned,
    };
    const targetNormalMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Member,
    };
    const targetAdminMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const targetInvitedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const targetBannedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Banned,
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });
    it('should throw if acting user is not a member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingNormalMember);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but invited member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingInvitedMember);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingBannedMember);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if acting member is not admin but banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingBannedMember);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });
    it('should throw if target member is admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetAdminMember);
      await expect(
        service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(CannotKickError);
    });
    it('should return if target is not a member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(undefined);
      expect(
        await service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toBeUndefined();
    });
    it('should kick and return if target is a normal member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetNormalMember);
      jest.spyOn(groupMemberRepo, 'remove').mockResolvedValueOnce(undefined);
      expect(
        await service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toBeUndefined();
    });
    it('should unban and return if target is a banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetBannedMember);
      jest.spyOn(groupMemberRepo, 'remove').mockResolvedValueOnce(undefined);
      expect(
        await service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toBeUndefined();
    });
    it('should revoke invitation and return if target is a banned member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetInvitedMember);
      jest.spyOn(groupMemberRepo, 'remove').mockResolvedValueOnce(undefined);
      expect(
        await service.removeMember(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toBeUndefined();
    });
  });

  describe('when promoting member of group', () => {
    const group: Group = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'group1',
      inviteOnly: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      members: undefined,
    };
    const actingNormalMember: GroupMember = {
      groupId: '00000000-0000-0000-0000-000000000000',
      memberId: '00000000-0000-0000-0000-000000000000',
      membershipStatus: GroupMembershipStatus.Member,
      group: null,
      member: null,
    };
    const actingAdminMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const actingInvitedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const actingBannedMember: GroupMember = {
      ...actingNormalMember,
      membershipStatus: GroupMembershipStatus.Banned,
    };
    const targetNormalMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Member,
    };
    const targetAdminMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Admin,
    };
    const targetInvitedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Invited,
    };
    const targetBannedMember: GroupMember = {
      ...actingNormalMember,
      memberId: '00000000-0000-0000-0000-000000000001',
      membershipStatus: GroupMembershipStatus.Banned,
    };

    it('should throw if group does not exist', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.promoteToAdmin(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(GroupDoesNotExistError);
    });

    it('should throw if acting member is not admin', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest.spyOn(groupMemberRepo, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.promoteToAdmin(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupAdminError);
    });

    it('should throw if target user is not a member', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(undefined);
      await expect(
        service.promoteToAdmin(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).rejects.toThrow(NotGroupMemberError);
    });

    it('should make admin and return if', async () => {
      jest.spyOn(groupRepo, 'findOne').mockResolvedValueOnce(group);
      jest
        .spyOn(groupMemberRepo, 'findOne')
        .mockResolvedValueOnce(actingAdminMember)
        .mockResolvedValueOnce(targetNormalMember);
      jest
        .spyOn(groupMemberRepo, 'save')
        .mockResolvedValueOnce(targetAdminMember);
      expect(
        await service.promoteToAdmin(
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000000',
          '00000000-0000-0000-0000-000000000001',
        ),
      ).toEqual(targetAdminMember);
    });
  });
});

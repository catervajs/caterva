import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { Repository } from 'typeorm';
import { FriendshipComposite } from './entities/friendship-composite-view.entity';
import { FriendshipOneWayRelationStatus } from './enums/friendship-one-way-relation-status.enum';
import { FriendshipTwoWayRelationStatus } from './enums/friendship-two-way-relation-status.enum';
import { FriendshipTwoWayRelationStatusesDto } from './dto/friendship-two-way-relation-statuses.dto';

export class SelfReferenceError extends Error {}

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(FriendshipComposite)
    private friendshipCompositeRepository: Repository<FriendshipComposite>,
  ) {}

  /**
   * Derive the two-way relation status given the normal and inverse one-way relation statuses
   * @param normalRelationStatus One-way relation status from a to b
   * @param inverseRelationStatus One-way relation status from b to a
   */
  private static _deriveTwoWayRelationStatus(
    normalRelationStatus: FriendshipOneWayRelationStatus,
    inverseRelationStatus: FriendshipOneWayRelationStatus,
  ): FriendshipTwoWayRelationStatus | null {
    if (
      normalRelationStatus === FriendshipOneWayRelationStatus.Ok &&
      inverseRelationStatus === FriendshipOneWayRelationStatus.Ok
    ) {
      return FriendshipTwoWayRelationStatus.Friends;
    }
    if (
      normalRelationStatus === FriendshipOneWayRelationStatus.Ok &&
      inverseRelationStatus === FriendshipOneWayRelationStatus.NoAction
    ) {
      return FriendshipTwoWayRelationStatus.SentRequest;
    }
    if (
      normalRelationStatus === FriendshipOneWayRelationStatus.NoAction &&
      inverseRelationStatus === FriendshipOneWayRelationStatus.Ok
    ) {
      return FriendshipTwoWayRelationStatus.ReceivedRequest;
    }
    if (
      normalRelationStatus === FriendshipOneWayRelationStatus.DidBlock &&
      inverseRelationStatus === FriendshipOneWayRelationStatus.GotBlocked
    ) {
      return FriendshipTwoWayRelationStatus.BlockedByYou;
    }
    if (
      normalRelationStatus === FriendshipOneWayRelationStatus.GotBlocked &&
      inverseRelationStatus === FriendshipOneWayRelationStatus.DidBlock
    ) {
      return FriendshipTwoWayRelationStatus.BlockedByOther;
    }
    // no complete relation
    return null;
  }

  /**
   * Get both one-way relation statuses from a to b and from b to a
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  private async _getNormalAndInverse(
    aId: string,
    bId: string,
  ): Promise<[Friendship, Friendship]> {
    return Promise.all([
      this.friendshipRepository.findOne({ aId: aId, bId: bId }),
      this.friendshipRepository.findOne({ aId: bId, bId: aId }),
    ]);
  }

  /**
   * Get the one-way relation status of a to b
   * @param aId Account UUID for the acting user
   * @param bId Account UUID for the referred user
   */
  async get(aId: string, bId: string): Promise<FriendshipTwoWayRelationStatus> {
    const [normal, inverse] = await this._getNormalAndInverse(aId, bId);
    return FriendService._deriveTwoWayRelationStatus(
      normal?.status,
      inverse?.status,
    );
  }

  /**
   * Get all two-way relation statuses of a user
   * @param aId
   */
  async getAll(aId: string): Promise<FriendshipTwoWayRelationStatusesDto> {
    const dto = new FriendshipTwoWayRelationStatusesDto();
    const friendshipComposites = await this.friendshipCompositeRepository.find({
      where: { aId: aId },
    });
    for (const friendshipComposite of friendshipComposites) {
      const finalStatus = FriendService._deriveTwoWayRelationStatus(
        friendshipComposite?.statusAtoB,
        friendshipComposite?.statusBtoA,
      );
      const id = friendshipComposite.bId;
      switch (finalStatus) {
        case FriendshipTwoWayRelationStatus.SentRequest:
          dto.sentRequests.push(id);
          break;
        case FriendshipTwoWayRelationStatus.ReceivedRequest:
          dto.receivedRequests.push(id);
          break;
        case FriendshipTwoWayRelationStatus.Friends:
          dto.friends.push(id);
          break;
        case FriendshipTwoWayRelationStatus.BlockedByYou:
          dto.blockedByYou.push(id);
          break;
        case FriendshipTwoWayRelationStatus.BlockedByOther:
          dto.blockedByOther.push(id);
          break;
      }
    }
    return dto;
  }

  /**
   * Individually set relations between two users
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   * @param normalStatus One way friendship relation from a to b
   * @param inverseStatus One way friendship relation from b to a
   * @private
   */
  private async _setRelations(
    aId: string,
    bId: string,
    normalStatus: FriendshipOneWayRelationStatus,
    inverseStatus: FriendshipOneWayRelationStatus,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    const normal = new Friendship();
    normal.aId = aId;
    normal.bId = bId;
    normal.status = normalStatus;

    const inverse = new Friendship();
    inverse.aId = bId;
    inverse.bId = aId;
    inverse.status = inverseStatus;

    const [savedNormal, savedInverse] = await this.friendshipRepository.save([
      normal,
      inverse,
    ]);
    return FriendService._deriveTwoWayRelationStatus(
      savedNormal?.status,
      savedInverse?.status,
    );
  }

  /**
   * Remove all relations between a and b
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   * @private
   */
  private async _removeRelations(aId: string, bId: string): Promise<void> {
    await Promise.all([
      this.friendshipRepository.delete({ aId: aId, bId: bId }),
      this.friendshipRepository.delete({ aId: bId, bId: aId }),
    ]);
  }

  /**
   * Set both one-way relations from a to b represent a friend request
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  async _sendFriendRequest(
    aId: string,
    bId: string,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    return this._setRelations(
      aId,
      bId,
      FriendshipOneWayRelationStatus.Ok,
      FriendshipOneWayRelationStatus.NoAction,
    );
  }

  /**
   * Set two-way relation as friends
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  async _acceptFriendRequest(
    aId: string,
    bId: string,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    return this._setRelations(
      aId,
      bId,
      FriendshipOneWayRelationStatus.Ok,
      FriendshipOneWayRelationStatus.Ok,
    );
  }

  /**
   * Send friend request from a to b, or accept friend request from b to a
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  async add(
    aId: string,
    bId: string,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    if (aId === bId) {
      throw new SelfReferenceError(
        `${aId} cannot reference itself for friendship operations`,
      );
    }
    const [normal, inverse] = await this._getNormalAndInverse(aId, bId);
    const currentFinalStatus = FriendService._deriveTwoWayRelationStatus(
      normal?.status,
      inverse?.status,
    );
    switch (currentFinalStatus) {
      case FriendshipTwoWayRelationStatus.BlockedByOther:
      case FriendshipTwoWayRelationStatus.BlockedByYou:
      case FriendshipTwoWayRelationStatus.SentRequest:
      case FriendshipTwoWayRelationStatus.Friends:
        // blocked status blocks any other action, return blocked status and do nothing.
        return currentFinalStatus;
      case FriendshipTwoWayRelationStatus.ReceivedRequest:
        return this._acceptFriendRequest(aId, bId);
      case null:
        return this._sendFriendRequest(aId, bId);
    }
  }

  /**
   * Remove friendship of a and b or discard friend request from b
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  async remove(
    aId: string,
    bId: string,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    if (aId === bId) {
      throw new SelfReferenceError(
        `${aId} cannot reference itself for friendship operations`,
      );
    }
    const [normal, inverse] = await this._getNormalAndInverse(aId, bId);
    const currentFinalStatus = FriendService._deriveTwoWayRelationStatus(
      normal?.status,
      inverse?.status,
    );
    switch (currentFinalStatus) {
      case FriendshipTwoWayRelationStatus.BlockedByOther:
      case FriendshipTwoWayRelationStatus.BlockedByYou:
        // blocked status blocks any other action, return blocked status and do nothing.
        return currentFinalStatus;
      default:
        await this._removeRelations(aId, bId);
        return null;
    }
  }

  /**
   * Block b for a
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  async block(
    aId: string,
    bId: string,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    if (aId === bId) {
      throw new SelfReferenceError(
        `${aId} cannot reference itself for friendship operations`,
      );
    }
    const [normal, inverse] = await this._getNormalAndInverse(aId, bId);
    const currentFinalStatus = FriendService._deriveTwoWayRelationStatus(
      normal?.status,
      inverse?.status,
    );
    switch (currentFinalStatus) {
      // already blocked statuses
      case FriendshipTwoWayRelationStatus.BlockedByYou:
      case FriendshipTwoWayRelationStatus.BlockedByOther:
        return currentFinalStatus;
      default:
        return this._setRelations(
          aId,
          bId,
          FriendshipOneWayRelationStatus.DidBlock,
          FriendshipOneWayRelationStatus.GotBlocked,
        );
    }
  }

  /**
   * Unblock b for a
   * @param aId Account UUID for acting user
   * @param bId Account UUID for referred user
   */
  async unblock(
    aId: string,
    bId: string,
  ): Promise<FriendshipTwoWayRelationStatus | null> {
    if (aId === bId) {
      throw new SelfReferenceError(
        `${aId} cannot reference itself for friendship operations`,
      );
    }
    const [normal, inverse] = await this._getNormalAndInverse(aId, bId);
    const currentFinalStatus = FriendService._deriveTwoWayRelationStatus(
      normal?.status,
      inverse?.status,
    );
    switch (currentFinalStatus) {
      case FriendshipTwoWayRelationStatus.BlockedByYou:
        await this._removeRelations(aId, bId);
        return null;
      default:
        return currentFinalStatus;
    }
  }
}

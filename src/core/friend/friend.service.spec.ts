import { FriendService } from './friend.service';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';
import { FriendshipComposite } from './entities/friendship-composite-view.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FriendshipOneWayRelationStatus } from './enums/friendship-one-way-relation-status.enum';
import { FriendshipTwoWayRelationStatus } from './enums/friendship-two-way-relation-status.enum';
import { FriendshipTwoWayRelationStatusesDto } from './dto/friendship-two-way-relation-statuses.dto';

describe('FriendService', () => {
  let service: FriendService;
  let friendshipRepo: Repository<Friendship>;
  let friendshipCompositeRepo: Repository<FriendshipComposite>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendService,
        {
          provide: getRepositoryToken(Friendship),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FriendshipComposite),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FriendService>(FriendService);
    friendshipRepo = module.get<Repository<Friendship>>(
      getRepositoryToken(Friendship),
    );
    friendshipCompositeRepo = module.get<Repository<FriendshipComposite>>(
      getRepositoryToken(FriendshipComposite),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when getting two-way relation status of x to y', () => {
    it('should return two-way relationship status with two ok users', async () => {
      const xy: Friendship = {
        aId: 'x',
        bId: 'y',
        status: FriendshipOneWayRelationStatus.Ok,
      };
      const yx: Friendship = {
        aId: 'y',
        bId: 'x',
        status: FriendshipOneWayRelationStatus.Ok,
      };
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce(xy)
        .mockResolvedValueOnce(yx);
      expect(await service.get('x', 'y')).toEqual(
        FriendshipTwoWayRelationStatus.Friends,
      );
    });
  });

  describe('when getting all relations of user', () => {
    it('should return list of all relations of user', async () => {
      const compositeList: FriendshipComposite[] = [
        {
          // should be friends
          aId: 'x',
          bId: 'a',
          statusAtoB: FriendshipOneWayRelationStatus.Ok,
          statusBtoA: FriendshipOneWayRelationStatus.Ok,
        },
        {
          // should be sent request
          aId: 'x',
          bId: 'b',
          statusAtoB: FriendshipOneWayRelationStatus.Ok,
          statusBtoA: FriendshipOneWayRelationStatus.NoAction,
        },
        {
          // should be received request
          aId: 'x',
          bId: 'c',
          statusAtoB: FriendshipOneWayRelationStatus.NoAction,
          statusBtoA: FriendshipOneWayRelationStatus.Ok,
        },
        {
          // should be blocked by you
          aId: 'x',
          bId: 'd',
          statusAtoB: FriendshipOneWayRelationStatus.DidBlock,
          statusBtoA: FriendshipOneWayRelationStatus.GotBlocked,
        },
        {
          // should be blocked by other
          aId: 'x',
          bId: 'e',
          statusAtoB: FriendshipOneWayRelationStatus.GotBlocked,
          statusBtoA: FriendshipOneWayRelationStatus.DidBlock,
        },
      ];
      const expected: FriendshipTwoWayRelationStatusesDto = {
        sentRequests: ['b'],
        receivedRequests: ['c'],
        friends: ['a'],
        blockedByYou: ['d'],
        blockedByOther: ['e'],
      };
      jest
        .spyOn(friendshipCompositeRepo, 'find')
        .mockResolvedValueOnce(compositeList);
      const result = await service.getAll('x');
      expect(result).toBeDefined();
      expect(result.sentRequests).toEqual(expected.sentRequests);
      expect(result.receivedRequests).toEqual(expected.receivedRequests);
      expect(result.friends).toEqual(expected.friends);
      expect(result.blockedByYou).toEqual(expected.blockedByYou);
      expect(result.blockedByOther).toEqual(expected.blockedByOther);
    });
  });

  describe('when adding friend', () => {
    beforeEach(() => {
      const saveMethod = jest.spyOn(friendshipRepo, 'save') as jest.Mock<any>;
      saveMethod.mockImplementation((input) => input);
    });
    afterEach(() => {
      const saveMethod = jest.spyOn(friendshipRepo, 'save') as jest.Mock<any>;
      saveMethod.mockClear();
    });
    it('should be sent request if users had no relation before', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);
      const result = await service.add('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.SentRequest);
    });
    it('should be accepted friendship request if other user had invited already', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.NoAction,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.Ok,
        });
      const result = await service.add('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.Friends);
    });
    it('should return current status if acting user blocked y', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.DidBlock,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.GotBlocked,
        });
      const result = await service.add('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.BlockedByYou);
    });
    it('should return current status if acting user got blocked by y', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.GotBlocked,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.DidBlock,
        });
      const result = await service.add('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.BlockedByOther);
    });
    it('should return current valid friendship status if acting user was already friends with other', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.Ok,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.Ok,
        });
      const result = await service.add('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.Friends);
    });
    it('should return current valid sent request status if acting user had already sent request to other', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.Ok,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.NoAction,
        });
      const result = await service.add('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.SentRequest);
    });
  });

  describe('when removing friend', () => {
    beforeEach(() => {
      const deleteMethod = jest.spyOn(
        friendshipRepo,
        'delete',
      ) as jest.Mock<any>;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      deleteMethod.mockImplementation(() => {});
    });
    afterEach(() => {
      const deleteMethod = jest.spyOn(
        friendshipRepo,
        'delete',
      ) as jest.Mock<any>;
      deleteMethod.mockClear();
    });
    it('should return block status if user blocked other', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.DidBlock,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.GotBlocked,
        });
      const result = await service.remove('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.BlockedByYou);
    });
    it('should return block status if other blocked user', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.GotBlocked,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.DidBlock,
        });
      const result = await service.remove('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.BlockedByOther);
    });
    it('should remove if conditions are valid', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.Ok,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.Ok,
        });
      const result = await service.remove('x', 'y');
      expect(result).toBeNull();
    });
  });

  describe('when blocking user', () => {
    beforeEach(() => {
      const saveMethod = jest.spyOn(friendshipRepo, 'save') as jest.Mock<any>;
      saveMethod.mockImplementation((input) => input);
    });
    afterEach(() => {
      const saveMethod = jest.spyOn(friendshipRepo, 'save') as jest.Mock<any>;
      saveMethod.mockClear();
    });
    it('should return blocked by other status if other user blocked this user first', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.GotBlocked,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.DidBlock,
        });
      const result = await service.block('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.BlockedByOther);
    });
    it('should return blocked by you status if user was not blocked already', async () => {
      jest
        .spyOn(friendshipRepo, 'findOne')
        .mockResolvedValueOnce({
          aId: 'x',
          bId: 'y',
          status: FriendshipOneWayRelationStatus.Ok,
        })
        .mockResolvedValueOnce({
          aId: 'y',
          bId: 'x',
          status: FriendshipOneWayRelationStatus.Ok,
        });
      const result = await service.block('x', 'y');
      expect(result).toEqual(FriendshipTwoWayRelationStatus.BlockedByYou);
    });
  });
});

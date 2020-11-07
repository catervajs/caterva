import { ViewColumn, ViewEntity } from 'typeorm';
import { FriendshipOneWayRelationStatus } from '../enums/friendship-one-way-relation-status.enum';

@ViewEntity({
  expression: `
    select
      "normal"."aId" as "aId",
      "normal"."bId" as "bId",
      "normal"."status" as "statusAtoB",
      "inverse"."status" as "statusBtoA"
    from "friendship" "normal"
        join "friendship" "inverse" on "normal"."aId" = "inverse"."bId" and "normal"."bId" = "inverse"."aId";
  `,
})
export class FriendshipComposite {
  @ViewColumn()
  aId: string;

  @ViewColumn()
  bId: string;

  @ViewColumn()
  statusAtoB: FriendshipOneWayRelationStatus;

  @ViewColumn()
  statusBtoA: FriendshipOneWayRelationStatus;
}

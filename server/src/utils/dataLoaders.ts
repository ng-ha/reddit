import { In } from 'typeorm';
import { User } from '../entities/User';
import DataLoader from 'dataloader';
import { Upvote } from '../entities/Upvote';

//[1,2] => [{id:1}, {id:2}] in the same order as input
const batchGetUsers = async (userIds: number[]) => {
  const users = await User.findBy({ id: In(userIds) });
  return userIds.map((userId) => users.find((user) => user.id === userId));
};

interface VoteTypeConditions {
  postId: number;
  userId: number;
}

//SELECT * FROM Upvote WHERE [postId, userId] IN [[31,1], [30,1], [21,1]]
//[{postId, userId}, ...] => [{...}, ...]
const batchGetVoteTypes = async (voteTypeConditions: VoteTypeConditions[]) => {
  // const voteTypes = await Upvote.findByIds({ voteTypeConditions }); // doesn't work
  // const voteTypes = await Upvote.findBy(voteTypeConditions); // works but type error
  const voteTypes = await Upvote.find({ where: voteTypeConditions });
  return voteTypeConditions.map((voteTypeCondition) =>
    voteTypes.find(
      (voteType) =>
        voteType.postId === voteTypeCondition.postId && voteType.userId === voteTypeCondition.userId
    )
  );
};

export const buildDataLoaders = () => ({
  userLoader: new DataLoader<number, User | undefined>((userIds) =>
    batchGetUsers(userIds as number[])
  ),
  voteTypeLoaders: new DataLoader<VoteTypeConditions, Upvote | undefined>((voteTypeConditions) =>
    batchGetVoteTypes(voteTypeConditions as VoteTypeConditions[])
  ),
});

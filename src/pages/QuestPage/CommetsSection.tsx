import { Avatar, Button, TextArea } from '@radix-ui/themes';
import { useAppSelector } from '../../store/store';
import {
  useAddCommentMutation,
  useGetQuestCommentsQuery
} from '../../store/comment/comment.api';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { routes } from '../../configs/routes';
import Comment from './Comment';

type CommetsSectionProps = {
  id: number;
};

function CommetsSection({ id }: CommetsSectionProps) {
  const { user } = useAppSelector((store) => store.auth);

  const [addComment, { isLoading: isCommentSending }] = useAddCommentMutation();
  const { data: comments, isLoading: isCommentsLoading } =
    useGetQuestCommentsQuery(id);
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState<string>('');
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  const handleAddComment = () => {
    if (!user) return void navigate(routes.login);

    if (!isCommentSending)
      addComment({ title: newComment, questId: id })
        .unwrap()
        .then(() => {
          if (newCommentRef.current) newCommentRef.current.value = '';
          setNewComment('');
        })
        .catch(console.log);
  };

  return (
    <section className="space-y-2 mb-4">
      <h2 className="font-bold text-lg">Comments:</h2>
      <div className="flex gap-2 items-stretch">
        <Avatar fallback="A" src={user?.image} size="5" />
        <TextArea
          ref={newCommentRef}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-grow"
        />
        <div>
          <Button
            disabled={newComment.length === 0}
            onClick={handleAddComment}
            className="!h-full">
            Comment
          </Button>
        </div>
      </div>

      <div>
        {!isCommentsLoading &&
          comments &&
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
      </div>
    </section>
  );
}

export default CommetsSection;

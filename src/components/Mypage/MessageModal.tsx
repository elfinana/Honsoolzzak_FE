import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { isOpenMessageModalAtom, messageAtom } from '../../store/modalStore';
import { CancelButton } from '../common/CancelButton';
import { receivedMessage, sendMessage, sentMessage } from '../../api/mypage';

export const MessageModal = () => {
  const queryClient = useQueryClient();
  const [messageInfo, setMessageInfo] = useAtom(messageAtom);
  const [username, setUsername] = useState<string | undefined>();
  const [content, setContent] = useState<string | undefined>();
  const [receivedIndex, setReceivedIndex] = useState<number | undefined>();
  const [, setIsOpenMessageModal] = useAtom(isOpenMessageModalAtom);
  const cancelHandler = () => {
    if (messageInfo.tab === '쪽지쓰기' || messageInfo.tab === '받은쪽지') {
      setMessageInfo({ ...messageInfo, tab: '받은쪽지함' });
    } else {
      setIsOpenMessageModal(false);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries('receivedMessage');
  }, [messageInfo.tab]);

  const { data: receivedData = [] } = useQuery('receivedMessage', receivedMessage, {
    refetchOnWindowFocus: false,
  });

  const { data: sentData = [] } = useQuery('sentMessage', sentMessage, {
    refetchOnWindowFocus: false,
  });

  const sendMessageMutation = useMutation(sendMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries('sentMessage');
    },
  });
  const sendMessageHandler = () => {
    if (!username || !content) return;

    const message = {
      receiverUsername: username,
      content,
    };
    sendMessageMutation.mutate(message);
    setUsername('');
    setContent('');
    setMessageInfo({ ...messageInfo, tab: '보낸쪽지함' });
  };

  const detailViewHandler = (i: number) => {
    setReceivedIndex(i);
    setMessageInfo({ ...messageInfo, tab: '받은쪽지' });
  };
  
  return (
    <div className="w-[500px] rounded-2xl bg-white f-jic-col py-5 relative">
      <div
        role="none"
        onClick={cancelHandler}
        className="absolute -right-1.5 -top-1.5"
      >
        <CancelButton />
      </div>
      <div className="w-[85%] flex flex-row justify-between py-5 f-jic">
        <div>
          <div
            className={`flex flex-row gap-4 text-lg font-bold ${
              messageInfo.tab === '쪽지쓰기' || messageInfo.tab === '받은쪽지'
                ? 'hidden'
                : ''
            }`}
          >
            <div
              role="none"
              className={`${
                messageInfo.tab === '받은쪽지함'
                  ? 'border-b-[3px] border-primary-300 text-primary-300'
                  : ''
              } hover:cursor-pointer`}
              onClick={() =>
                setMessageInfo({ ...messageInfo, tab: '받은쪽지함' })
              }
            >
              받은쪽지함
            </div>
            <div
              role="none"
              className={`${
                messageInfo.tab === '보낸쪽지함'
                  ? 'border-b-[3px] border-primary-300 text-primary-300'
                  : ''
              } hover:cursor-pointer`}
              onClick={() =>
                setMessageInfo({ ...messageInfo, tab: '보낸쪽지함' })
              }
            >
              보낸쪽지함
            </div>
          </div>
          <div
            role="none"
            className={`${
              messageInfo.tab === '쪽지쓰기'
                ? 'text-primary-300 font-bold text-lg'
                : 'hidden'
            }`}
          >
            쪽지쓰기
          </div>
          <div
            role="none"
            className={`${
              messageInfo.tab === '받은쪽지'
                ? 'text-primary-300 font-bold text-lg'
                : 'hidden'
            }`}
          >
            받은쪽지
          </div>
        </div>
        {messageInfo.tab !== '받은쪽지' && (
          <div
            role="none"
            className={`${
              messageInfo.tab === '쪽지쓰기'
                ? 'hidden'
                : 'w-20 h-7 rounded-2xl bg-secondary-100 text-base font-semibold text-secondary-200 border border-secondary-200 f-jic hover:cursor-pointer hover:bg-secondary-200 hover:text-secondary-50'
            }`}
            onClick={() => setMessageInfo({ ...messageInfo, tab: '쪽지쓰기' })}
          >
            쪽지쓰기
          </div>
        )}

        <div
          role="none"
          className={`${
            messageInfo.tab === '쪽지쓰기'
              ? 'absolute bottom-6 right-5 w-20 h-7 rounded-2xl bg-secondary-100 text-base font-semibold text-secondary-200 border border-secondary-200 f-jic hover:cursor-pointer hover:bg-secondary-200 hover:text-secondary-50'
              : 'hidden'
          }`}
          onClick={sendMessageHandler}
        >
          쪽지쓰기
        </div>
      </div>
      {messageInfo.tab === '받은쪽지함' && (
        <div className="w-[90%] h-[350px] rounded-lg border border-[#D9D9D9] mb-7">
          <div className="flex flex-col w-full text-center h-full text-base font-semibold">
            <div className="w-full h-[15%] flex flex-row bg-[#F8F8F8] border-b-[1px] border-[#D9D9D9] mb-1">
              <p className="w-[20%] h-full border-r-[1px] f-jic text-base">
                보낸사람
              </p>
              <p className="w-[60%] h-full border-r-[1px] f-jic text-base">
                내용
              </p>
              <p className="w-[20%] h-full f-jic text-base">날짜</p>
            </div>

            <div className='f-col overflow-y-auto'>
            {receivedData?.map((item, index) => (
              <div
                role="none"
                key={item.messageId}
                className="w-full flex cursor-pointer"
                onClick={() => detailViewHandler(index)}
              >
                <div className="w-[20%] text-base overflow-hidden truncate">
                  {item.senderUsername}
                </div>
                <div className="w-[60%] text-base overflow-hidden truncate text-start indent-3">
                  {item.content}
                </div>
                <div className="w-[20%] mb-1">
                  {new Date(item.createdAt)
                    .toLocaleDateString()
                    .replace(/\s/gi, '')
                    .substring(2, 9)}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
      {messageInfo.tab === '받은쪽지' && (
        <div className="w-[90%] h-[350px] mb-7">
          <div className="flex flex-col w-full h-full text-base">
            <div className="w-full h-[15%] flex flex-row mb-3 justify-between">
              <p className="w-1/6 h-full f-jic text-base font-semibold">
                보낸사람
              </p>

              <div className="w-1/2 border h-full rounded-lg f-ic indent-2 font-semibold">
                {
                  receivedData?.[receivedIndex as number]
                    .senderUsername
                }
              </div>

              <div className="w-2/6 flex flex-row items-center pl-2 font-semibold">
                <span className="w-full px-2 text-center">날짜</span>
                <div className="flex w-full">
                  {receivedData?.[receivedIndex as number].createdAt &&
                    new Date(
                      receivedData?.[receivedIndex as number].createdAt
                    )
                      .toLocaleDateString()
                      .replace(/\s/gi, '')
                      .substring(2, 9)}
                </div>
              </div>
            </div>

            <div className="border border-[D9D9D9] h-full rounded-lg indent-2 pt-2 font-medium">
              {receivedData?.[receivedIndex as number].content}
            </div>
          </div>
        </div>
      )}
      {messageInfo.tab === '보낸쪽지함' && (
        <div className="w-[90%] h-[350px] rounded-lg border border-[#D9D9D9] mb-7">
          <div className="flex flex-col w-full text-center h-full text-base font-semibold">
            <div className="w-full h-[15%] flex flex-row bg-[#F8F8F8] border-b-[1px] border-[#D9D9D9] mb-1">
              <p className="w-[20%] h-full border-r-[1px] f-jic text-base">
                받는사람
              </p>
              <p className="w-[60%] h-full border-r-[1px] f-jic text-base">
                내용
              </p>
              <p className="w-[20%] h-full f-jic text-base">날짜</p>
            </div>

            <div className="f-col overflow-y-auto">
              {sentData?.map((item) => (
                <div className="w-full flex" key={item.messageId}>
                  <div className="w-[20%] text-base overflow-hidden truncate">
                    {item.receiverUsername}
                  </div>
                  <div className="w-[60%] text-base overflow-hidden truncate text-start indent-3">
                    {item.content}
                  </div>
                  <div className="w-[20%] mb-1">
                    {new Date(item.createdAt)
                      .toLocaleDateString()
                      .replace(/\s/gi, '')
                      .substring(2, 9)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {messageInfo.tab === '쪽지쓰기' && (
        <div className="w-[90%] h-[350px] pb-4">
          <div className="flex flex-col w-full h-full text-base">
            <div className="w-full h-[15%] flex flex-row mb-3">
              <p className="min-w-max h-full f-jic text-base px-2 font-semibold">
                받는사람
              </p>

              <input
                className="w-full border rounded-lg indent-2 placeholder:indent-2"
                type="text"
                placeholder="닉네임을 입력하세요."
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <textarea
              style={{
                border: '1px solid #D9D9D9',
                height: '100%',
                borderRadius: '8px',
                textIndent: '0.5em',
              }}
              maxLength={150}
              value={content || ''}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
        </div>
      )}
      {messageInfo.tab === '쪽지쓰기' && (
        <div className="self-start ml-7 mb-1 text-[#AAAAAA] font-medium">
          {content?.length}/150자
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { MainpageRooms } from '../../api/main';
import { ChatroomCard } from './ChatroomCard';

export const HomeBodySection = ({setIsOpenJoinRoom}: {setIsOpenJoinRoom: React.Dispatch<React.SetStateAction<boolean>>}) => {
  // const { data, isLoading, isError, error } = useQuery(
  //   'chatrooms',
  //   getMainpageRooms,
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );
  const [chatList, setChatList] = useState<MainpageRooms[] | undefined>([]);

  // useEffect(() => {
  //   if (data) {
  //     setChatList(data.data);
  //     console.log(data.data);
  //   }
  // }, [data]);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }
  // if (isError) {
  //   return <p>{(error as Error).message}</p>;
  // }
  const joinRoomHandler = () => setIsOpenJoinRoom(true);
  return (
    <section className="flex-grow w-full">
      <div className="f-ic-col min-w-[660px]">
        <div className="px-5">
          <div className="f-ic justify-between my-10 w-full">
            <p className="font-bold text-xl">방 리스트</p>
            <button
              type="button"
              className=" rounded-full bg-white px-4 py-2 text-secondary-200 font-semibold"
            >
              방 설정
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
            <div className="w-60 h-72 bg-slate-500" role='none' onClick={joinRoomHandler}>color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>
            <div className="w-60 h-72 bg-slate-500">color</div>

            {chatList?.map((chatRoom) => (
              <ChatroomCard key={chatRoom.roomId} chatRoom={chatRoom} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

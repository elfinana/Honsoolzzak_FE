import { useAtom } from 'jotai';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Notifications } from '../../assets/svgs/Notifications';
import { useModal } from '../../hooks/useModal';
import { CommonButton } from '../common/CommonButton';
import { Modal } from '../common/Modal';
import { LoginModal } from '../login/LoginModal';
import { AddRoom } from './AddRoom';
import { usernameAtom } from '../../store/mainpageStore';
import { ProfileMenu } from './ProfileMenu';

type AuthToken = {
  sub: string;
};

export const HeaderRightSection = () => {
  const [isOpenAuth, onCloseAuth, setIsOpenAuth] = useModal();
  const [isOpenRoomCreate, onCloseRoomCreate, setIsOpenRoomCreate] = useModal();
  const [user] = useAtom(usernameAtom);

  const [userInfo, setUserInfo] = useState<AuthToken>();

  useEffect(() => {
    if (user) {
      setUserInfo(jwtDecode(user));
    }
  }, [user]);

  console.log(userInfo);
  return (
    <section
      className={`f-ic justify-end mr-4 md:min-w-[200px]
      ${user ? 'min-w-[490px]' : 'min-w-[180px]'}`}
    >
      <Modal isOpen={isOpenAuth} hasOverlay onClose={onCloseAuth}>
        <LoginModal onClose={onCloseAuth} />
      </Modal>
      <Modal isOpen={isOpenRoomCreate} onClose={onCloseRoomCreate} hasOverlay>
        <AddRoom onClose={onCloseRoomCreate} />
      </Modal>
      {userInfo ? (
        <>
          <CommonButton
            buttonText="혼술짝 방만들기"
            clickHandler={() => setIsOpenRoomCreate(true)}
            dimensions="mr-7 min-w-[185px]"
          />
          <Notifications />
          <ProfileMenu user={userInfo.sub} setUserInfo={setUserInfo} />
        </>
      ) : (
        <CommonButton
          buttonText="로그인"
          clickHandler={() => setIsOpenAuth(true)}
          dimensions="mr-7 min-w-[70px]"
        />
      )}
    </section>
  );
};

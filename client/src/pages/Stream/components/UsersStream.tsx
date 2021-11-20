import { Box, Flex, Grid } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import RemoteStream from '../../../components/RemoteStream';
import calcSize from '../../../utils/render/calcSize';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

interface Props {}

const UsersStream: React.FC<Props> = () => {
  const { mySocketId } = useAppSelector((state) => state.stream);
  const { users, updateLayout } = useAppSelector(
    (state) => state.room.roomInfo
  );
  const { isShareScreen } = useAppSelector((state) => state.room.roomInfo);

  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    // Only use for normal mode
    if (users.length - 1 > 0 && !isShareScreen) {
      setTimeout(() => {
        if (!document.getElementById('video-container')) return;
        let { width, height } = calcSize({
          width: document.getElementById('video-container')!.clientWidth,
          height: document.getElementById('video-container')!.clientHeight,
          minRatio: 9 / 16,
          maxRatio: 8 / 5,
          count: users.length - 1,
        });
        if (width) {
          setWidth(width);
        }
        if (height) {
          setHeight(height);
        }
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, updateLayout]);

  return (
    <>
      {!isShareScreen ? (
        <Flex
          id="video-container"
          flexWrap="wrap"
          h="calc(100vh - 100px - 40px)"
          justifyContent="center"
          flexDirection="column"
        >
          {users.map((user, i) => (
            <>
              {(user.socketId !== mySocketId ||
                user.streamType === 'screen') && (
                <Box
                  w={width}
                  h={height}
                  key={i}
                  className={`overlay__container ` + user.socketId}
                >
                  <RemoteStream user={user} count={users.length - 1} />
                </Box>
              )}
            </>
          ))}
        </Flex>
      ) : (
        <Grid
          gridTemplateRows="repeat(12,1fr)"
          gridTemplateColumns="repeat(24,1fr)"
          h="calc(100vh - 100px - 40px)"
          gridGap="10px"
        >
          {users.map((user, i) => (
            <>
              {user.streamType === 'screen' && (
                <>
                  <Box
                    gridColumn="1/18"
                    gridRow="span 24"
                    key={i}
                    className="overlay__container"
                  >
                    <RemoteStream user={user} count={users.length - 1} />
                  </Box>
                </>
              )}
            </>
          ))}
          <Box gridColumn="18/span 6" gridRow="span 24">
            <Swiper direction={'vertical'} slidesPerView={3}>
              {users.map((user, i) => (
                <>
                  {user.socketId !== mySocketId &&
                    user.streamType !== 'screen' && (
                      <SwiperSlide>
                        <Box key={i} className="overlay__container">
                          <RemoteStream user={user} count={users.length - 1} />
                        </Box>
                      </SwiperSlide>
                    )}
                </>
              ))}
            </Swiper>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default UsersStream;

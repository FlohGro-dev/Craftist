import { animated, useSpring } from '@react-spring/web';
import React, { useState } from 'react';
import styled from 'styled-components';
import CraftApiWrapper from '../craftApiWrapper';
import Defines from '../utils/defines';



// styles
const StyledTextDiv = styled.div`
    color: ${(props) => props.theme.primaryTextColor};
    padding-top: 10px;
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
`;

const StyledContainer = styled(animated.div)`
  overflow-x: hidden;
`;

const StyledFrame = styled.iframe`
  height: 25px;
  cursor: pointer;
  z-index: 1;
`;

const StyledFrameContainerDiv = styled.div`
  position: relative;
`;

const StyledOverlayDiv = styled.div`
  background: transparent;
  position: absolute;
  z-index: 1;
  height: 25px;
  width: 100%;
  cursor: pointer;
  overflow-x: auto;
`;

const StyledLinkDiv = styled.a`
  color: red;
  transition: filter 200ms ease-in;
  overflow-x: auto;
  cursor: pointer;
  &:hover: {
    filter: brightness(1.3);
  }
`;

const StyledHeader = styled.div`
    padding-top: 15px;
    font-size: 15px;
    color: red;
`;




const InfoPanel: React.FC = () => {
    const [iFrameLoaded, setIframeLoaded] = useState(false);
    const [props] = useSpring(() => ({
        from: { opacity: 0 },
        opacity: 1,
        config: { duration: 200 },
    }));
    return (
        <StyledContainer style={props}>
            <StyledTextDiv>
                Version:
                {' '}
                {Defines.CURRENT_VERSION}
                {' '}
                (beta)
            </StyledTextDiv>
            <StyledFrameContainerDiv>
                <StyledOverlayDiv onClick={() => CraftApiWrapper.openUrl(
                    Defines.CRAFTIST_DOWNLOAD_LINK,
                )}
                >
                    {
                        (!iFrameLoaded) && <StyledTextDiv>Checking for updates...</StyledTextDiv>
                    }
                </StyledOverlayDiv>
                <StyledFrame frameBorder="0" onLoad={() => setIframeLoaded(true)} src={Defines.CRAFTIST_UPDATE_STATUS_LINK} />
            </StyledFrameContainerDiv>
            <StyledHeader>
                Hi There ✌️
            </StyledHeader>
            <StyledTextDiv>
                I&apos;m
                {' '}
                <StyledLinkDiv onClick={() => CraftApiWrapper.openUrl(Defines.WEBSITE_LINK)}>
                    FlohGro
                </StyledLinkDiv>
                .
                {' '}
                the developer of Craftist. Thank you for downloading and using this eXtension.
            </StyledTextDiv>
            <StyledHeader>
                Help 🆘, Bugs 🐛 & Feedback 📫
            </StyledHeader>
            <StyledTextDiv>
                You can find the documentation and helpful videos in the
                {' '}
                <StyledLinkDiv onClick={
                    () => CraftApiWrapper.openUrl(Defines.CRAFTIST_REPOSITORY_LINK)
                }
                >
                    Craftist repository
                </StyledLinkDiv>.
                If you find any issues, miss features or have suggestions you can add them in the
                {' '}
                <StyledLinkDiv onClick={
                    () => CraftApiWrapper.openUrl(Defines.CRAFTIST_REPOSITORY_LINK)
                }
                >
                    Craftist repository
                </StyledLinkDiv>
                {' '}
                or reach out to me on
                {' '}
                <StyledLinkDiv onClick={
                    () => CraftApiWrapper.openUrl(Defines.TWITTER_LINK)
                }
                >
                    Twitter
                </StyledLinkDiv>
                .
                Alternatively you can also contact me by
                {' '}
                <StyledLinkDiv onClick={
                    () => CraftApiWrapper.openUrl(Defines.MAIL_TO_LINK)
                }
                >
                    email
                </StyledLinkDiv>
                .
            </StyledTextDiv>
            <StyledHeader>
                Support Development 😍
            </StyledHeader>
            <StyledTextDiv>
                Craftist is entirely free to use for you.
            </StyledTextDiv>
            <StyledTextDiv>
                If you find it useful and want to give something back you can support me on
                {' '}
                <StyledLinkDiv onClick={
                    () => CraftApiWrapper.openUrl(Defines.BUYMEACOFFEE_LINK)
                }
                >
                    buymeacoffee
                </StyledLinkDiv>
                {' '}
                or
                {' '}
                <StyledLinkDiv onClick={
                    () => CraftApiWrapper.openUrl(Defines.PATREON_LINK)
                }
                >
                    patreon
                </StyledLinkDiv>
                .
            </StyledTextDiv>
            <StyledTextDiv>
                Thank you in advance!
            </StyledTextDiv>
        </StyledContainer>
    );
}

export default InfoPanel;
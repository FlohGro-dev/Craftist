import * as React from "react"
import * as ReactDOM from 'react-dom'
import * as Recoil from "recoil";
import * as TodoistWrapper from "./todoistApiWrapper";
//import { AppendButton, LoginForm, TodayPane } from "./components";
import { LoginForm, LogoutButton, ImportTodaysTasksButton, ImportProjectListButton, CrosslinkTasksButton, SyncTaskStatesButton } from "./components";
import { ChakraProvider, ThemeConfig, ConfigColorMode } from "@chakra-ui/react";
import { Container, Stack, Box, Flex } from "@chakra-ui/layout";
import { extendTheme } from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import { Skeleton } from "@chakra-ui/skeleton";
// import craftXIconSrc from "./craftx-icon.png"
// import { TodoistApi } from '@doist/todoist-api-typescript'
// import { CraftBlockInsert, CraftBlock, CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";

const config: ThemeConfig = {
  initialColorMode: getCraftColorMode(),
  useSystemColorMode: false,
}


const theme = extendTheme({ config,
    fontSizes: {
      md: "13px",
      sm: "11px",
      lg: "15px",
    },
 });


const Content: React.FC = () => {
  return (
    <Box>
      <Flex
        fontSize="lg"
        h="44px"
        mb="2"
        boxSizing="border-box"
        justifyContent="center"
        alignItems="center"
      >
        Craftist
      </Flex>
      <React.Suspense
        fallback={
          <Stack>
            <Skeleton width="100%" height="300px" />
          </Stack>
        }
      >
      <ImportTodaysTasksButton />
      <CrosslinkTasksButton />
      <SyncTaskStatesButton />
      <ImportProjectListButton />
      <Divider colorScheme={getCraftColorMode()} />
      <LogoutButton />
      </React.Suspense>
    </Box>
  );
};

const App: React.FC = () => {
  let [token, setToken] = Recoil.useRecoilState(TodoistWrapper.apiToken);
  const isLogin = !!token;
  React.useEffect(() => {
    // craft.storageApi
    //   .get(States.API_TOKEN_KEY)
    //   .then((resp) => resp.data ?? "")
    //   .then((token) => {
    //     setToken(token);
    //   });
    const k = window.localStorage.getItem(TodoistWrapper.API_TOKEN_KEY) ?? "";
    setToken(k);
  }, [setToken]);
  if (!isLogin) {
    return <LoginForm />;
  }
  return <Content />;
};


const Wrapper: React.FC = () => {
  return (
    <ChakraProvider
      theme={theme}
        //   extendTheme({
        //   //initialColorMode: getCraftColorMode(),
        //   initialColorMode: `dark`,
        //   useSystemColorMode: false,
        //   fontSizes: {
        //     md: "13px",
        //     sm: "11px",
        //     lg: "15px",
        //   },
        // })}
    >
      <Container
        minW={260}
        maxW={300}
        width="280"
        fontSize="md"
        overflowY="hidden"
      >
        <Recoil.RecoilRoot>
          <React.Suspense fallback={<Skeleton h="60vh" />}>
            <App />
          </React.Suspense>
        </Recoil.RecoilRoot>
      </Container>
    </ChakraProvider>
  );
};

function getCraftColorMode() {
  let colorMode: ConfigColorMode = `light`
    craft.env.setListener((env) => {
      switch (env.colorScheme) {
        case "dark":
        colorMode = `dark`;
          break;
        case "light":
        colorMode = `light`
          break;
      }

    }
  )
  return colorMode;
}



export function initApp() {
  ReactDOM.render(
    <Wrapper />
    ,
    document.getElementById('react-root')
  )
}

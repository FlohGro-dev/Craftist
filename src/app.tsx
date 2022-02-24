import * as React from "react"
import * as ReactDOM from 'react-dom'
import * as Recoil from "recoil";
import { ImportTodaysTasksButton, ImportProjectListButton, CrosslinkTasksButton, SyncTaskStatesButton, CreateTasksFromSelectionButton, ImportAllTasksButton, LinkToExistingProjectButton, ImportTasksFromLinkedProjectButton, SettingsMenu, LoginLogoutButton } from "./components";
import { ChakraProvider, ThemeConfig, Badge, Center, Spinner, VStack } from "@chakra-ui/react";
import { Container, Box, Flex } from "@chakra-ui/layout";
import { extendTheme } from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import { Skeleton } from "@chakra-ui/skeleton";
import { CraftEnv } from "./types"
import { DevicePlatform } from "@craftdocs/craft-extension-api";
import { readStoredApiTokenToVariable, } from "./todoistApiWrapper";
// import craftXIconSrc from "./craftx-icon.png"
// import { TodoistApi } from '@doist/todoist-api-typescript'
// import { CraftBlockInsert, CraftBlock, CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";

const config: ThemeConfig = {
//  initialColorMode: getCraftColorMode(),
  //initialColorMode: useCraftEnv().isDarkMode ? 'dark':'light',
  initialColorMode: 'light',
  useSystemColorMode: true,
}

//const { colorMode, toggleColorMode } = useColorMode();

const theme = extendTheme({ config,
    fontSizes: {
      md: "13px",
      sm: "11px",
      lg: "15px",
    },
    colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
      50: '#f7fafc',
      // ...
      900: '#171923',

    },
    // ...
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
          <VStack align="center"
          >
          <Spinner
            thickness='3px'
            speed='1.0s'
            emptyColor='gray.200'
            color='red.200'
            size='xl'
          />

          </VStack>
        }
      >
      <Badge>Create / Link</Badge>
      <CreateTasksFromSelectionButton />
      <CrosslinkTasksButton />
      <LinkToExistingProjectButton />
      <Badge>Sync</Badge>
      <SyncTaskStatesButton />
      <Badge>Import</Badge>
      <ImportTasksFromLinkedProjectButton />
      <ImportTodaysTasksButton />
      <ImportAllTasksButton />
      <ImportProjectListButton />
      <Center height='50px'>
        <Divider size="5px" />
      </Center>
      <SettingsMenu />
      <LoginLogoutButton />
      </React.Suspense>
    </Box>
  );
};

const App: React.FC = () => {
  const craftEnv = useCraftEnv();
  const readTokenIntoVar = readStoredApiTokenToVariable();
  readTokenIntoVar();

  React.useEffect(() => {
    if (craftEnv.isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [craftEnv.isDarkMode]);


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

function useCraftEnv(): CraftEnv {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [platform, setPlatform] = React.useState<DevicePlatform>("Web");

  React.useEffect(() => {
    craft.env.setListener(env => {
      setIsDarkMode(env.colorScheme === "dark")
      setPlatform(env.platform)
    });
  }, []);

  return {
    isDarkMode,
    platform
  };
}


export async function initApp() {
  ReactDOM.render(
    <Wrapper />
    ,
    document.getElementById('react-root')
  )
}

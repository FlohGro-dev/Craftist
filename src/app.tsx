import { Box, Container, Flex } from "@chakra-ui/layout";
import { Badge, ChakraProvider, extendTheme, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, ThemeConfig, VStack } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/skeleton";
import { DevicePlatform } from "@craftdocs/craft-extension-api";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Recoil from "recoil";
import { CreateTasksFromSelectionButton, CrosslinkTasksButton, ImportAllTasksButton, ImportProjectListButton, ImportTasksFromLinkedProjectButton, ImportTasksWithLabel, ImportTodaysTasksButton, InfoPanel, LinkToExistingProjectButton, LoginLogoutButton, SettingsMenu, SyncTaskStatesButton } from "./components";
import { writeDefaultSettings } from "./settingsUtils";
import { readStoredApiTokenToVariable } from "./todoistApiWrapper";
import { CraftEnv } from "./types";

const config: ThemeConfig = {
  //  initialColorMode: getCraftColorMode(),
  //initialColorMode: useCraftEnv().isDarkMode ? 'dark':'light',
  initialColorMode: 'light',
  useSystemColorMode: true,
}

//const { colorMode, toggleColorMode } = useColorMode();

const theme = extendTheme({
  config,
  fontSizes: {
    md: "11px",
    sm: "9px",
    lg: "13px",
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
    <Box w='100%'>
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
      <Tabs w='100%' isLazy isFitted size='md' variant='solid-rounded' colorScheme='red'>
        <TabList>
          <Tab borderRadius='5px'>Features</Tab>
          <Tab borderRadius='5px'>Settings</Tab>
          <Tab borderRadius='5px'>Info</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
              <ImportTasksWithLabel />
              <ImportAllTasksButton />
              <ImportProjectListButton />
            </React.Suspense>
          </TabPanel>
          <TabPanel>
            <LoginLogoutButton />
            <SettingsMenu />
          </TabPanel>
          <TabPanel>
            <InfoPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const App: React.FC = () => {
  const craftEnv = useCraftEnv();
  const readTokenIntoVar = readStoredApiTokenToVariable();
  readTokenIntoVar();
  writeDefaultSettings();

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

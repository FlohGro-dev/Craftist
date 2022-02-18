import React from "react";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useLoginCallback } from "../todoistApiWrapper";
import { Alert } from "@chakra-ui/alert";
import { ScaleFade } from "@chakra-ui/transition";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure } from "@chakra-ui/react";

const LoginForm = () => {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [token, setToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const login = useLoginCallback();
  const onSubmit = () => {
    setIsLoading(true);
    login(token)
      .catch(() => setErrorMsg("This APIToken is invalid"))
      .finally(() => setIsLoading(false));
  };
  const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
      <Button onClick={onOpen}>Login</Button>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Provide Todoist API token</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder="input API Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <ScaleFade in={!!errorMsg} initialScale={0.1}>
              <Alert fontSize="sm" status="error">
                {errorMsg}
              </Alert>
            </ScaleFade>
          </DrawerBody>
          <DrawerFooter>
            // <Button type='submit' form='my-form'>
            //   Save
            // </Button>
              <Button
                type='submit'
                isLoading={isLoading}
                onClick={onSubmit}
                colorScheme="blue"
                w="100%"
              >
                Set Token
              </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      </>
      // <Container centerContent gridGap="2" mt={12}>
      //   <Input
      //     placeholder="input API Token"
      //     value={token}
      //     onChange={(e) => setToken(e.target.value)}
      //   />
      //   <ScaleFade in={!!errorMsg} initialScale={0.1}>
      //     <Alert fontSize="sm" status="error">
      //       {errorMsg}
      //     </Alert>
      //   </ScaleFade>
      //   <Button
      //     isLoading={isLoading}
      //     onClick={onSubmit}
      //     colorScheme="blue"
      //     w="100%"
      //   >
      //     Set Token
      //   </Button>
      // </Container>
    );
};

export default LoginForm;

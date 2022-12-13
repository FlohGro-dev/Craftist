import { Button } from "@chakra-ui/button";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Center, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import React from "react";
import * as TodoistWrapper from "../todoistApiWrapper";

const LoginLogoutButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const [isLoadingSet, setIsLoadingSet] = React.useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);
  const [token, setToken] = React.useState("");
  const login = TodoistWrapper.useLoginCallback();
  const logout = TodoistWrapper.useLogoutCallback();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSet = async () => {
    setIsLoadingSet(true);
    login(token)
      .catch(() => {
        toast({
          position: "bottom",
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                Login failed
              </Box>
            </Center>
          ),
        })
      })
      .finally(() => {
        setIsLoadingSet(false)
        toast({
          position: "bottom",
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
                Logged in
              </Box>
            </Center>
          ),
        })
      });
  }

  const onDelete = async () => {
    setIsLoadingDelete(true);
    logout();
    setIsLoadingDelete(false);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
            Logged out
          </Box>
        </Center>
      ),
    })
  }


  return (
    <>
      <Button onClick={onOpen}
        width="100%"
        mb="1"
        rightIcon={<ArrowForwardIcon />}
        colorScheme='orange'
      >Login/Logout</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Login / Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Todoist API token</FormLabel>
              <Input
                placeholder='[api-token]'
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <FormHelperText>Retrieve your API token from the Settings in Todoist</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onSet} isLoading={isLoadingSet}>
              Set Token
            </Button>
            <Button colorScheme='red' mr={3} onClick={onDelete} isLoading={isLoadingDelete}>
              Delete Token
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export default LoginLogoutButton;

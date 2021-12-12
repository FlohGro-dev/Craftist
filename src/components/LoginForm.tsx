import React from "react";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Container } from "@chakra-ui/layout";
import { useLoginCallback } from "../todoistApiWrapper";
import { Alert } from "@chakra-ui/alert";
import { ScaleFade } from "@chakra-ui/transition";

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
  return (
    <Container centerContent gridGap="2" mt={12}>
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
      <Button
        isLoading={isLoading}
        onClick={onSubmit}
        colorScheme="blue"
        w="100%"
      >
        Set Token
      </Button>
    </Container>
  );
};

export default LoginForm;

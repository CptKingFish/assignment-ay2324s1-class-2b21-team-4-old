import { type FormEventHandler, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { api } from "@/utils/api";
import { toast_duration } from "@/utils/constants";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const { mutate: login, isLoading: isLoggingIn } =
    api.user.login.useMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!email || !password) return;
    if (password.length < 8) {
      toast({
        title: "Password must be at least 8 characters long",
        status: "error",
        duration: toast_duration,
        isClosable: true,
      });
      return;
    }
    login(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          // router.push("/chat").catch(console.error);
          window.location.href = "/chat";
          toast({
            title: data.message,
            status: "success",
            duration: toast_duration,
            isClosable: true,
          });
        },
        onError: (error) => {
          toast({
            title: error.message,
            status: "error",
            duration: toast_duration,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <Flex
      // height="100vh"
      backgroundColor="gray.50"
    >
      <Box
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        backgroundColor="white"
        minWidth={{ base: "auto", md: "400px" }}
      >
        <Heading mb={6}>Login</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email address</FormLabel>
            <Input
              required
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Password</FormLabel>
            <Input
              required
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
          <Button disabled={isLoggingIn} colorScheme="blue" type="submit">
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default Login;

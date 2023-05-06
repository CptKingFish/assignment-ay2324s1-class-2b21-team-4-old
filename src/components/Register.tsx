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

function Register() {
  const toast = useToast();
  const { mutate: register, isLoading: isRegistering } =
    api.user.register.useMutation();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!email || !password || !username) return;
    if (password.length < 8) {
      toast({
        title: "Password must be at least 8 characters long",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    register(
      {
        email,
        password,
        username,
      },
      {
        onSuccess: (data) => {
          toast({
            title: data.message,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        },
        onError: (error) => {
          toast({
            title: error.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <Flex alignItems="center" justifyContent="center" backgroundColor="gray.50">
      <Box
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        backgroundColor="white"
        minWidth={{ base: "auto", md: "400px" }}
      >
        <Heading mb={6}>Register</Heading>
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
          <FormControl mb={4}>
            <FormLabel>Username</FormLabel>
            <Input
              required
              type="text"
              placeholder="Choose a cute username :)"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
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
          <Button isLoading={isRegistering} colorScheme="blue" type="submit">
            Register
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default Register;

import Header from "@/components/header";
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, VStack, Container, InputGroup, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isEmailError = email === ''
  const isPasswordError = password === ''
  return (
    <div>
      <Header />
      <VStack>
        <Container >
          <FormControl isInvalid={isEmailError}>
            <FormLabel>Email</FormLabel>
            <Input type='email' value={email} onChange={(e) =>setEmail(e.target.value)} />
            {!isEmailError ? (
              <FormHelperText>
                Enter the email you'd like to receive the newsletter on.
              </FormHelperText>
            ) : (
              <FormErrorMessage>Email is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isPasswordError}>
            <FormLabel>Password</FormLabel>
            <Input type='email' value={password} onChange={(e) =>setPassword(e.target.value)} />
            {!isPasswordError ? (
              <FormHelperText>
                Enter the Password you'd like to receive the newsletter on.
              </FormHelperText>
            ) : (
              <FormErrorMessage>Password is required.</FormErrorMessage>
            )}
          </FormControl>
          <Button colorScheme="blue">
            登録
          </Button>
        </Container>
      </VStack>
    </div>
  );
}

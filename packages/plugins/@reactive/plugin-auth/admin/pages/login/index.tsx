import { Obj } from "@reactive/client"
import { ActionButton, Anchor, Card, Field, FieldControl, FieldLabel, Form, Heading, HStack, Input, Stack, StackProps, Text, useToast } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setAuthToken } from "../../utils"
export interface LoginPageProps extends StackProps {
    children?: any
}

const auth = new Obj("auth")
export function LoginPage({ children, ...props }: LoginPageProps) {
    const toast = useToast({
        position: "top",
        isClosable: true
    })
    const navigate = useNavigate()
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [loading, setLoading] = useState(false)
    const login = async (login: any) => {
        try {
            setLoading(true)
            setErrors([])
            const { token } = await auth.call("login", { body: login, method: "post" }) || {}
            setAuthToken(token)
            window.location.href = "/admin"
        } catch (e) {
            console.error(e)
            if (e.errors) {
                setErrors(e.errors)
            }
            toast({
                status: "error",
                title: "Error",
                description: e.message
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <Stack {...props}
            minH="100vh"
            justifyContent="center"
            alignItems="center"
            overflowY="auto"
        >
            <Stack spacing={1} justifyContent="center"
                alignItems="center">
                <Heading>
                    Welcome
                </Heading>
                <Text>
                    to Reactive Server
                </Text>
            </Stack>
            <Card p="4" w="100%" maxW="md">
                <Stack>
                    <Form errors={errors} onSubmit={login}>
                        <Stack>
                            <FieldControl>
                                <FieldLabel>Email-ID</FieldLabel>
                                <Field name="email">
                                    <Input autoFocus type="email" />
                                </Field>
                            </FieldControl>
                            <FieldControl>
                                <FieldLabel>Password</FieldLabel>
                                <Field name="password">
                                    <Input type="password" />
                                </Field>
                            </FieldControl>
                            <ActionButton isDisabled={loading} isLoading={loading} type="submit">LOGIN</ActionButton>
                        </Stack>
                    </Form>
                    <HStack justifyContent="center" fontSize="xs" pt={4}>
                        <Anchor>
                            <Text>Forgot Password?</Text>
                        </Anchor>
                        <Text>|</Text>
                        <Link to="/register">
                            <Text>Create New Account</Text>
                        </Link>
                    </HStack>
                </Stack>
            </Card>
        </Stack>
    )
}

export default LoginPage
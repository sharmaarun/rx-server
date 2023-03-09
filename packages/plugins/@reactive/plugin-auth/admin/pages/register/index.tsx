import { Obj } from "@reactive/client"
import { ActionButton, Anchor, Card, Field, FieldControl, FieldLabel, Form, Heading, HStack, Input, Stack, StackProps, Text, useToast } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setAuthToken } from "../../utils"
export interface RegisterPageProps extends StackProps {
    children?: any
}

const auth = new Obj("auth")
export function RegisterPage({ children, ...props }: RegisterPageProps) {
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
            const { token } = await auth.call("register", login, "post")
            setAuthToken(token)
            navigate("/admin")
        } catch (e) {
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
            <Stack spacing={2} justifyContent="center"
                alignItems="center">
                <Text>
                    Welcome to Reactive Server
                </Text>
                <Heading size="sm">
                    Please fill below form to create a new account
                </Heading>
            </Stack>
            <Card p="4" w="100%" maxW="md">
                <Stack>
                    <Form errors={errors} onSubmit={login}>
                        <Stack>
                            <FieldControl>
                                <FieldLabel>Name</FieldLabel>
                                <Field name="name">
                                    <Input placeholder="Enter full name separated by spaces" />
                                </Field>
                            </FieldControl>
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
                            <FieldControl>
                                <FieldLabel>Repeat Password</FieldLabel>
                                <Field name="repassword">
                                    <Input type="password" />
                                </Field>
                            </FieldControl>

                            <ActionButton isDisabled={loading} isLoading={loading} type="submit">CREATE ACCOUNT</ActionButton>
                        </Stack>
                    </Form>
                    <HStack justifyContent="center" fontSize="xs" pt={4}>
                        <Anchor>
                            <Text>Forgot Password?</Text>
                        </Anchor>
                        <Text>|</Text>
                        <Anchor>
                            <Link to="/login">
                                <Text>Login</Text>
                            </Link>
                        </Anchor>
                    </HStack>
                </Stack>
            </Card>
        </Stack>
    )
}

export default RegisterPage
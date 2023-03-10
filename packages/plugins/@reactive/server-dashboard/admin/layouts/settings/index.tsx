import { Heading, HStack, Page, PageBody, PageHeader, PageProps, Stack } from "@reactive/ui"
import { SettingsMenu } from "../../components/settings-menu"

export interface SettingsLayoutProps extends PageProps {
    children?: any
}

export function SettingsLayout({ children, ...props }: SettingsLayoutProps) {
    return (
        <HStack
            w="100%"
            minH="100vh"
            alignItems="top"
        >
            <Stack w="250px"
                borderRight="1px solid"
                borderColor="blackAlpha.100"
            >
                <Page {...props}>
                    <PageHeader>
                        <Heading size="md">
                            Settings
                        </Heading>
                    </PageHeader>
                    <PageBody>
                        <SettingsMenu />
                    </PageBody>
                </Page>
            </Stack>
            <Stack flex={1}>
                {children}
            </Stack>
        </HStack>

    )
}

export default SettingsLayout
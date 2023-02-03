export interface RXICO_BORDER_ALLProps {

}

export function RXICO_BORDER_ALL(props: RXICO_BORDER_ALLProps) {
    return (
        <svg width="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{
                __html: `
            <mask id="path-1-inside-1_1414_200" fill="white">
                <rect x="4.90851" y="4.6626" width="14.675" height="14.675" rx="1" />
            </mask>
            <rect x="4.90851" y="4.6626" width="14.675" height="14.675" rx="1" stroke="currentColor" stroke-width="3" mask="url(#path-1-inside-1_1414_200)" />
            `}} />

    )
}

export default RXICO_BORDER_ALL
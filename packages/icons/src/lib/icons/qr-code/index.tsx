export interface RXICO_QR_CODEProps {

}

export function RXICO_QR_CODE(props: RXICO_QR_CODEProps) {
    return (
        // <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        //     dangerouslySetInnerHTML={{
        //         __html: `
        // <path d="M9.0717 3H3V8.9013M15.0358 3H21V8.9013M21 15.4424V21H15.0358M9.01792 21H3V14.9507" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        // <rect x="6.5" y="6.5" width="4" height="4" stroke="currentColor"/>
        // <rect x="6.5" y="13.5" width="4" height="4" stroke="currentColor"/>
        // <rect x="13.5" y="6.5" width="4" height="4" stroke="currentColor"/>
        // <rect x="13" y="13" width="5" height="5" fill="currentColor"/>
        // `}} />
        <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{
                __html: `
            <path d="M6 4.75H10.25V10.25H4.75V6C4.75 5.30964 5.30964 4.75 6 4.75Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M4.75 13.75H10.25V19.25H6C5.30964 19.25 4.75 18.6904 4.75 18V13.75Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M13.75 4.75H18C18.6904 4.75 19.25 5.30964 19.25 6V10.25H13.75V4.75Z" stroke="currentColor" stroke-width="1.5" />
            <rect x="7" y="7" width="1" height="1" fill="currentColor" />
            <rect x="16" y="7" width="1" height="1" fill="currentColor" />
            <rect x="7" y="16" width="1" height="1" fill="currentColor" />
            <rect x="13" y="13" width="3" height="3" fill="currentColor" />
            <rect x="13" y="17" width="3" height="3" fill="currentColor" />
            <rect x="16" y="15" width="4" height="3" fill="currentColor" />
            <rect x="18" y="15" width="2" height="5" fill="currentColor" />
            `}} />


    )
}

export default RXICO_QR_CODE
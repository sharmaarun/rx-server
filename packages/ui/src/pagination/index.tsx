import { Button, HStack } from "@chakra-ui/react";
import { RXICO_CHEVRON_LEFT, RXICO_CHEVRON_RIGHT } from "@reactive/icons";
import React from "react";
import { DOTS, usePagination } from "../utils/hooks/usePagination";

export type PaginationProps = {
    onPageChange?: (page: number) => void
    total?: number
    siblingCount?: number
    page?: number
    pageSize?: number
    className?: string
}

export const Pagination = (props: PaginationProps) => {
    const {
        onPageChange,
        total = 24,
        siblingCount = 1,
        page = 1,
        pageSize = 12,
        className
    } = props;

    const paginationRange = usePagination({
        page,
        total,
        siblingCount,
        pageSize
    }) || [];

    // If there are less than 2 times in pagination range we shall not render the component
    if (page === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange?.(page + 1);
    };

    const onPrevious = () => {
        onPageChange?.(page - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    const Button_ = (props: any) => <Button
        cursor="pointer"
        variant="outline"
        colorScheme="purple"
        fontSize="xs"
        fontWeight="normal"
        p={0}
        h={8}
        w={8}
        {...props}
    />
    return (
        <HStack
            spacing={2}
        >
            <Button_
                p={0}
                onClick={onPrevious}
                w="8"
            >
                <RXICO_CHEVRON_LEFT />
            </Button_>

            {paginationRange.map(pageNumber => {

                if (pageNumber === DOTS) {
                    return <Button_ colorScheme="blackAlpha" className="pagination-item dots">&#8230;</Button_>;
                }

                return (
                    <Button_ variant={pageNumber == page ? "solid" : "outline"} onClick={() => onPageChange?.(parseInt(pageNumber + ""))}>
                        {pageNumber}
                    </Button_>
                );
            })}

            <Button_
                w="8"
                p={0}
                onClick={onNext}
            >
                <RXICO_CHEVRON_RIGHT />
            </Button_>
        </HStack>
    );
};

export default Pagination;
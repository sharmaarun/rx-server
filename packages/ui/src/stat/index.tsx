import React from "react"
import { Stat as _Stat, StatProps as _StatProps } from "@chakra-ui/react"
export interface StatProps extends _StatProps {

}

export function Stat(props: StatProps) {
    return (
        <_Stat {...props} />
    )
}

import { StatGroup as _StatGroup, StatGroupProps as _StatGroupProps } from "@chakra-ui/react"
export interface StatGroupProps extends _StatGroupProps {

}

export function StatGroup(props: StatGroupProps) {
    return (
        <_StatGroup {...props} />
    )
}

import { StatLabel as _StatLabel, StatLabelProps as _StatLabelProps } from "@chakra-ui/react"
export interface StatLabelProps extends _StatLabelProps {

}

export function StatLabel(props: StatLabelProps) {
    return (
        <_StatLabel {...props} />
    )
}

import { StatNumber as _StatNumber, StatNumberProps as _StatNumberProps } from "@chakra-ui/react"
export interface StatNumberProps extends _StatNumberProps {

}

export function StatNumber(props: StatNumberProps) {
    return (
        <_StatNumber {...props} />
    )
}

import { StatHelpText as _StatHelpText, StatHelpTextProps as _StatHelpTextProps } from "@chakra-ui/react"
export interface StatHelpTextProps extends _StatHelpTextProps {

}

export function StatHelpText(props: StatHelpTextProps) {
    return (
        <_StatHelpText {...props} />
    )
}

import { StatArrow as _StatArrow, StatArrowProps as _StatArrowProps } from "@chakra-ui/react"
export interface StatArrowProps extends _StatArrowProps {

}

export function StatArrow(props: StatArrowProps) {
    return (
        <_StatArrow {...props} />
    )
}

export default {
    Stat,
    StatArrow,
    StatHelpText,
    StatNumber,
    StatLabel,
    StatGroup
}
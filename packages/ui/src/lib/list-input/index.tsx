import { RXICO_EDIT, RXICO_FOCUS, RXICO_SORT, RXICO_TRASH } from '@reactive/icons';
import { t, toPascalCase } from '@reactive/commons';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import Box, { BoxProps } from '../box';
import Icon, { IconButton } from '../icon';
import Image from '../image';
import Stack, { HStack } from '../stack';
import { Tag } from '../tag';
import Text from '../text';
import Tooltip from '../tooltip';
const styles = require("./index.module.css");

export interface ListInputProps extends Partial<Omit<BoxProps, "children">> {
  renderItem?: (item: any) => any;
  titleKey?: string;
  imgKey?: string;
  multiple?: boolean;
  value?: any;
  onChange?: (value: any) => any | JSX.Element;
  children?: (items: any) => any;
  emptyStateMessage?: any;
  onEditClick?: (item: any, index?: number) => void;
  showFields?: string[]
}

type RenderItemProps = Partial<ListInputProps> & {
  index?: number;
  item: any;
  allowDrag?: boolean;
  onDelete?: (item: any, index?: number) => void;
}

const RenderItem = ({
  item,
  titleKey = "name",
  imgKey,
  allowDrag = false,
  onDelete,
  onEditClick,
  index = -1,
  showFields
}: RenderItemProps) => {

  const _onDelete = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.key === undefined || e.key === null || (e.key === "Enter" || e.key === " ")) {
      onDelete?.(item, index)
    }
  }

  return (
    <HStack
      p={4}
      className={styles["item"]}
      pos="relative"
      alignItems="flex-start"
      borderTop={index > 0 ? "1px solid" : ""}
      borderTopColor={index > 0 ? "borderlight" : ""}
    >
      {<Box pt={1}>
        {allowDrag && <Icon display={"none"} className={styles["dragHandle"]}>
          <RXICO_SORT />
        </Icon>
        }
        <Box className={allowDrag ? styles["rowIcon"] : ""}>
          {(imgKey && item?.[imgKey]?.length) ? <Image src={item[imgKey] + "?w=32px"} width="24px" height="24px" /> :
            <Icon >
              <RXICO_FOCUS />
            </Icon>
          }
        </Box>
      </Box>
      }
      <Stack pt={1} wordBreak="break-all" flex={1}>
        <Text pt={1} fontWeight="semibold">{item?.[titleKey] ? item?.[titleKey] : ("Untitled "+(index+1))}</Text>
        {showFields && showFields?.length > 0 ? <>
          {Object.keys(item).filter(k => showFields?.includes(k)).map(k => <HStack>
            <Tag >
              {toPascalCase(k)} : {item[k]}
            </Tag>
          </HStack>)}
        </> : ""}
      </Stack>
      {<HStack >
        {onEditClick && <Tooltip label={t("Edit")}>
          <IconButton onClick={() => { onEditClick?.(item, index) }} p={0} aria-label={t("Delete")} variant="ghost">
            <Icon>
              <RXICO_EDIT />
            </Icon>
          </IconButton>
        </Tooltip>}
        <Tooltip label={t("Remove")}>
          <IconButton colorScheme="red" onClick={_onDelete} onKeyUpCapture={_onDelete} p={0} aria-label={t("Delete")} variant="ghost">
            <Icon>
              <RXICO_TRASH />
            </Icon>
          </IconButton>
        </Tooltip>
      </HStack>
      }
    </HStack>
  )
}

export const ListInput = forwardRef(({
  renderItem = RenderItem,
  titleKey = 'name',
  imgKey = "imgUrl",
  multiple = false,
  value: data = [],
  onChange: _onChange = () => null,
  children,
  emptyStateMessage,
  onEditClick,
  showFields,
  ...props
}: ListInputProps, ref: any) => {
  // const [data, setData] = React.useState<any[]>(value);

  useImperativeHandle(ref, () => ({
    onDeleteAll
  }))

  const onDelete = useCallback((item: any, index: number) => {
    const newData = data?.splice(index, 1)
    _onChange([...(data || [])]);
  }, [data, _onChange])

  const onDeleteAll = useCallback(() => {
    _onChange([]);
  }, [data, _onChange]);

  data = Array.isArray(data) ? data : [data]
  return (
    <>
      <Stack
        {...(data?.length <= 0 ? { tabIndex: 0 } : {})}
        _focusVisible={{ outline: "2px solid ", outlineColor: "brand.600" }}
        border="1px solid"
        borderColor="inputborder"
        transition="0.2s all"
        _hover={{
          transition: "0.2s all",
          borderColor: "inputborderhover"
        }}
        borderRadius="5"
        overflow="hidden"
        bg="brand.50"
        spacing={0}
        {...props}
      >
        {data?.length > 0 && data?.map((item: any, index: number) =>
          <Box
            _hover={{
              bg: "card"
            }}
            key={index}
          >
            {renderItem({ index, item, showFields, onEditClick, onDelete, titleKey, imgKey, allowDrag: data.length > 1 && multiple })}
          </Box>
        )}
        {!data! || data?.length <= 0 ? <HStack p={4}>
          <Box flex={1} color="blackAlpha.500" textAlign="center">{emptyStateMessage || t("No data")}</Box>
        </HStack> : ""}
        {typeof children === "function" ? children?.(data) : children}
      </Stack>
    </>

  )
});

export default ListInput
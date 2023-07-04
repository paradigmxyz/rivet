import * as Tabs_ from '@radix-ui/react-tabs'

import { Bleed, Box, Inline, Separator, Text } from '~/design-system'

import * as styles from './TabsList.css'

type TabsListProps = {
  items: {
    label: string
    value: string
  }[]
}

export function TabsList({ items }: TabsListProps) {
  return (
    <>
      <Tabs_.List asChild>
        <Inline gap='12px'>
          {items.map((item) => (
            <Tabs_.Trigger
              asChild
              className={styles.tabTrigger}
              key={item.value}
              value={item.value}
            >
              <Box
                alignItems='center'
                justifyContent='center'
                cursor='pointer'
                display='flex'
                style={{ height: '44px' }}
              >
                <Text size='16px'>{item.label}</Text>
              </Box>
            </Tabs_.Trigger>
          ))}
        </Inline>
      </Tabs_.List>
      <Bleed horizontal='-12px'>
        <Separator />
      </Bleed>
    </>
  )
}

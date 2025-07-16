/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2025-07-16 11:16:27
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2025-07-16 21:15:58
 * @FilePath: /chatbox/src/renderer/modals/ProviderSelector.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { AIModelProviderMenuOptionList } from '@/packages/models'
import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react'
import { Box, Dialog, DialogContent, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ModelProvider, ModelProviderEnum } from '../../shared/types'

const ProviderSelector = NiceModal.create(() => {
  const { t } = useTranslation()
  const modal = useModal()

  const onSetup = (provider: ModelProvider) => {
    modal.resolve(provider)
    modal.hide()
  }

  return (
    <Dialog
      {...muiDialogV5(modal)}
      onClose={() => {
        modal.resolve()
        modal.hide()
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <p className="text-sm text-gray-600 dark:text-gray-300 m-0">
            {t('Select and configure an AI model provider')}
          </p>
        </Box>
        <List sx={{ width: '100%' }}>
          {AIModelProviderMenuOptionList.map((provider) => (
            <ListItem key={provider.value} disablePadding>
              <ListItemButton
                onClick={() => onSetup(provider.value)}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={provider.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key={'custom'} disablePadding>
            <ListItemButton
              onClick={() => onSetup(ModelProviderEnum.Custom)}
              sx={{
                borderRadius: '8px',
                mb: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ListItemText
                primary={t('Add Custom Provider')}
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  )
})

export default ProviderSelector

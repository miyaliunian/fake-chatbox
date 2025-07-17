import NiceModal from '@ebay/nice-modal-react'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import CopyIcon from '@mui/icons-material/CopyAll'
import EditIcon from '@mui/icons-material/Edit'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import VrpanoIcon from '@mui/icons-material/Vrpano'
import { Avatar, IconButton, ListItemIcon, ListItemText, MenuItem, Typography, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { SessionMeta } from '@/../shared/types'
import { ImageInStorage } from '@/components/Image'
import { useIsSmallScreen } from '@/hooks/useScreenChange'
import { cn } from '@/lib/utils'
import * as sessionActions from '@/stores/sessionActions'
import { getSession, removeSession, saveSession } from '@/stores/sessionStorageMutations'
import { ConfirmDeleteMenuItem } from './ConfirmDeleteButton'
import StyledMenu from './StyledMenu'

export interface Props {
  session: SessionMeta
  selected: boolean
}

function _SessionItem(props: Props) {
  const { session, selected } = props
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const onClick = () => {
    sessionActions.switchCurrentSession(session.id)
  }
  const theme = useTheme()
  const medianSize = theme.typography.pxToRem(24)
  const isSmallScreen = useIsSmallScreen()
  // const smallSize = theme.typography.pxToRem(20)
  return (
    <>
      <MenuItem
        key={session.id}
        selected={selected}
        onClick={onClick}
        sx={{ padding: '0.1rem', margin: '0.1rem' }}
        className="group/session-item"
      >
        <ListItemIcon>
          <IconButton onClick={onClick}>
            {session.assistantAvatarKey ? (
              <Avatar
                sizes={medianSize}
                sx={{
                  width: medianSize,
                  height: medianSize,
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <ImageInStorage
                  storageKey={session.assistantAvatarKey}
                  className="object-cover object-center w-full h-full"
                />
              </Avatar>
            ) : session.picUrl ? (
              <Avatar sizes={medianSize} sx={{ width: medianSize, height: medianSize }} src={session.picUrl} />
            ) : session.type === 'picture' ? (
              <VrpanoIcon fontSize="small" />
            ) : (
              <ChatBubbleOutlineOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </ListItemIcon>
        {/* ------------会话名称 ------------ */}
        <ListItemText>
          <Typography variant="inherit" noWrap>
            {session.name || '新会话'}
          </Typography>
        </ListItemText>
        <span
          className={cn(
            session.starred || anchorEl || isSmallScreen ? 'inline-flex' : 'hidden group-hover/session-item:inline-flex'
          )}
        >
          <IconButton onClick={handleMenuClick} sx={{ color: 'primary.main' }}>
            {session.starred ? <StarIcon fontSize="small" /> : <MoreHorizOutlinedIcon fontSize="small" />}
          </IconButton>
        </span>
      </MenuItem>
      {/* 编辑、复制、星标、删除 */}
      <StyledMenu
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem
          key={`${session.id}edit`}
          onClick={() => {
            // 获取完整的Session对象，因为SessionMeta不包含messages字段
            const fullSession = getSession(session.id)
            if (fullSession) {
              NiceModal.show('session-settings', {
                session: fullSession,
              })
            }
            handleMenuClose()
          }}
          disableRipple
        >
          <EditIcon fontSize="small" />
          {t('edit')}
        </MenuItem>

        <MenuItem
          key={`${session.id}copy`}
          onClick={() => {
            sessionActions.copy(session)
            handleMenuClose()
          }}
          disableRipple
        >
          <CopyIcon fontSize="small" />
          {t('copy')}
        </MenuItem>
        <MenuItem
          key={`${session.id}star`}
          onClick={() => {
            saveSession({
              id: session.id,
              starred: !session.starred,
            })
            handleMenuClose()
          }}
          disableRipple
          divider
        >
          {session.starred ? (
            <>
              <StarOutlineIcon fontSize="small" />
              {t('unstar')}
            </>
          ) : (
            <>
              <StarIcon fontSize="small" />
              {t('star')}
            </>
          )}
        </MenuItem>

        <ConfirmDeleteMenuItem
          onDelete={() => {
            setAnchorEl(null)
            handleMenuClose()
            removeSession(session.id)
          }}
        />
      </StyledMenu>
    </>
  )
}

export default function Session(props: Props) {
  return useMemo(() => {
    return <_SessionItem {...props} />
  }, [
    props.session.id,
    props.session.name,
    props.session.starred,
    props.session.assistantAvatarKey,
    props.session.picUrl,
    props.session.type,
    props.selected,
  ])
}

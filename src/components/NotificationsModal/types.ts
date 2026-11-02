export type NotificationStatus = 'success' | 'error'

export interface NotificationLink {
  /** Text shown in brand colour, e.g. "Lana Steiner" or "Fips jobs" */
  label: string
  href?: string
}

export interface NotificationAttachment {
  name: string
  /** Human readable size, e.g. "720 KB" */
  size: string
  /** Short file type label shown on the file icon, e.g. "PDF" */
  type: string
}

export interface NotificationItem {
  id: string
  status: NotificationStatus
  title: string
  /** Relative time, e.g. "2 mins ago" */
  time: string
  /** Plain supporting text ("This is the short error message.") */
  description?: string
  /** Supporting text with a link: `${prefix} <link>.` ("Saved by Lana Steiner.") */
  prefix?: string
  link?: NotificationLink
  /** Quoted longer message rendered in a bubble with a "Read more" action */
  message?: string
  attachment?: NotificationAttachment
  unread?: boolean
}

export type NotificationsTab = 'activity' | 'transfers'

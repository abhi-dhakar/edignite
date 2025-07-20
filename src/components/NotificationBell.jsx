'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = (id, link) => {
    markAsRead(id);
    if (link) {
      setTimeout(() => setOpen(false), 300);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center transform translate-x-1 -translate-y-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-[400px] overflow-hidden flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[320px]">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification._id}
                className={`p-3 border-b hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                {notification.link ? (
                  <Link 
                    href={notification.link}
                    onClick={() => handleNotificationClick(notification._id, notification.link)}
                    className="block"
                  >
                    <NotificationItem notification={notification} />
                  </Link>
                ) : (
                  <div onClick={() => handleNotificationClick(notification._id)}>
                    <NotificationItem notification={notification} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-2 border-t text-center">
          <Button variant="link" size="sm" className="text-xs">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ notification }) {
 
  const getIcon = () => {
    switch (notification.type) {
      case 'success': 
        return <div className="h-2 w-2 rounded-full bg-green-500 mt-1 mr-2" />;
      case 'warning': 
        return <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1 mr-2" />;
      case 'error': 
        return <div className="h-2 w-2 rounded-full bg-red-500 mt-1 mr-2" />;
      default: 
        return <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 mr-2" />;
    }
  };

  return (
    <div className="flex">
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm">{notification.title}</p>
        <p className="text-xs text-gray-600">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
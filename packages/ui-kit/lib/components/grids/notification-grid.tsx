import { notification } from '@maany_shr/e-class-models';
import { AllCommunityModule, ColDef, ModuleRegistry, RowNode } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { Button } from '../button';
import { Tabs, TabList, TabTrigger, TabContent } from '../tabs/tab';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface ExtendedNotification extends notification.TNotification {
  platform: string; // e.g., "justdoad", "bewerbeagentur", "cms"
}

export interface NotificationGridProps extends isLocalAware {
  notifications: ExtendedNotification[];
  onNotificationClick: (notification: ExtendedNotification) => void;
  gridRef: RefObject<AgGridReact>;
  variant?: 'student' | 'coach' | 'cms';
  platforms?: string[]; // For CMS variant
}

ModuleRegistry.registerModules([AllCommunityModule]);

const PAGE_SIZE = 15;

const NotificationMessageRenderer = (props: { value: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const message = props.value || '';
  return (
    <div
      className="flex items-center text-sm my-2.5 space-x-2"
      onClick={() => setIsExpanded(prevState => !prevState)}
    >
      <span className={isExpanded ? 'text-wrap' : 'truncate'}>{message}</span>
      {isExpanded ? <ChevronUp className="flex-shrink-0 w-4 h-4" /> : <ChevronDown className="flex-shrink-0 w-4 h-4" />}
    </div>
  );
};

const NotificationActionRenderer = (props: { value: notification.TNotification['action'] }) => {
  const action = props.value;
  return <Button variant="text" className="text-sm px-0" text={action?.title || ''} />;
};

const NotificationStatusRenderer = (props: { value: boolean }) => {
  const isRead = props.value;
  return isRead ? null : (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-full bg-base-brand-500 w-2 h-2"></div>
    </div>
  );
};

// Mock backend API call to fetch notifications with platform (only for CMS variant)
const fetchNotificationsWithPlatform = async (
  notifications: ExtendedNotification[],
  platforms: string[]
): Promise<ExtendedNotification[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return notifications.map(notification => {
    const searchString = `${notification.message || ''} ${notification.action?.title || ''}`.toLowerCase();
    let platform = platforms[0] || 'justdoad'; // Default to first platform or fallback
    if (searchString.includes('assignment')) platform = platforms.find(p => p === 'bewerbeagentur') || platform;
    else if (searchString.includes('workspace')) platform = platforms.find(p => p === 'cms') || platform;
    return { ...notification, platform };
  });
};

/**
 * A component that displays a grid of notifications with filtering, pagination, and tabbed navigation for different platforms.
 *
 * @param notifications An array of notification objects, each extended with a platform property.
 * @param onNotificationClick Callback function to handle clicking on a notification action.
 * @param gridRef A React ref object for accessing the AgGridReact instance.
 * @param variant Optional variant to determine the grid's behavior ('student', 'coach', or 'cms'). Defaults to 'student'.
 * @param platforms Optional array of platform names for filtering notifications in the CMS variant. Defaults to ['justdoad', 'bewerbeagentur', 'cms'].
 * @param locale The locale for translations, used to fetch localized dictionary strings.
 */
export const NotificationGrid = ({
  notifications,
  onNotificationClick,
  locale,
  gridRef,
  variant = 'student',
  platforms = ['justdoad', 'bewerbeagentur', 'cms'],
}: NotificationGridProps) => {
  const dictionary = getDictionary(locale);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modifiedNotifications, setModifiedNotifications] = useState<ExtendedNotification[]>(notifications);
  const [isLoading, setIsLoading] = useState(variant === 'cms');

  // Fetch notifications with platform for CMS variant
  useEffect(() => {
    if (variant === 'cms') {
      setIsLoading(true);
      fetchNotificationsWithPlatform(notifications, platforms)
        .then(fetchedNotifications => {
          setModifiedNotifications(fetchedNotifications);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
          setModifiedNotifications(notifications);
          setIsLoading(false);
        });
    } else {
      setModifiedNotifications(notifications);
      setIsLoading(false);
    }
  }, [notifications, platforms, variant]);

  // Mark all notifications as read
  const handleMarkAllRead = useCallback(() => {
    setModifiedNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: '',
      field: 'isRead',
      cellRenderer: NotificationStatusRenderer,
      maxWidth: 40,
      minWidth: 40,
    },
    {
      flex: 1,
      field: 'message',
      wrapText: true,
      autoHeight: true,
      cellRenderer: NotificationMessageRenderer,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'action',
      headerName: 'Action',
      cellRenderer: NotificationActionRenderer,
      onCellClicked: (event) => {
        const notification = event.data as ExtendedNotification;
        onNotificationClick(notification);
      },
    },
    {
      field: 'timestamp',
      headerName: 'Date & Time',
      valueFormatter: (params) => (params.value ? formatDate(new Date(params.value)) : ''),
      filter: 'agDateColumnFilter',
    },
  ]);

  // Get notification counts for each tab
  const notificationCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    platforms.forEach(platform => (counts[platform] = 0));

    if (isLoading) return counts;

    return modifiedNotifications.reduce((acc, notification) => {
      acc.all++;
      if (acc[notification.platform] !== undefined) acc[notification.platform]++;
      return acc;
    }, counts);
  }, [modifiedNotifications, isLoading, platforms]);

  // Client-side filtering logic for search
  const doesExternalFilterPass = useCallback(
    (node: RowNode<ExtendedNotification>) => {
      const notification = node.data as ExtendedNotification;
      if (!notification) return false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const messageMatch = notification.message?.toLowerCase().includes(searchLower);
        const actionMatch = notification.action?.title?.toLowerCase().includes(searchLower);
        return messageMatch || actionMatch;
      }
      return true;
    },
    [searchTerm]
  );

  // Force refresh the grid when the external filter changes
  const refreshGrid = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
      gridRef.current.api.onFilterChanged();
    }
  }, [doesExternalFilterPass, gridRef]);

  // Apply filter when search term changes
  useEffect(() => {
    refreshGrid();
  }, [refreshGrid, searchTerm]);

  // Initialize the grid with external filters
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
      gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
      refreshGrid();
    }
  }, [doesExternalFilterPass, refreshGrid, gridRef]);

  // Render grid with actions
  const renderGridWithActions = (notifications: ExtendedNotification[]) => (
    <div>
      <div className="flex items-center justify-between mb-2 mt-4 ml-1">
        <div className="flex-grow mr-2 relative">
          <input
            type="text"
            placeholder={dictionary.components.notificationGrid?.searchPlaceholder || 'Search notifications...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded bg-input-fill text-text-primary border-input-stroke focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 text-gray-500 opacity-50 z-10" />
        </div>
        <Button
          variant="primary"
          size="medium"
          text={dictionary.components.notificationGrid.markAllAsRead}
          onClick={handleMarkAllRead}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-text-secondary">
          [ Loading... ]
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-text-secondary">
          {dictionary.components.notificationGrid?.noNotifications}
        </div>
      ) : (
        <BaseGrid
          gridRef={gridRef}
          suppressRowHoverHighlight={true}
          columnDefs={columnDefs}
          rowData={notifications}
          pagination={true}
          paginationPageSize={PAGE_SIZE}
          suppressPaginationPanel={true}
          domLayout="normal"
          isExternalFilterPresent={() => true}
          doesExternalFilterPass={doesExternalFilterPass}
          getRowStyle={(params) => {
            if (!params.data.isRead) {
              return { backgroundColor: 'var(--color-base-neutral-800)' };
            }
          }}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {variant === 'cms' ? (
        <Tabs.Root defaultTab="all" onValueChange={setSelectedTab}>
          <TabList
            className="flex bg-base-neutral-800 rounded-medium gap-2 text-sm whitespace-nowrap min-w-max"
            variant="small"
          >
            <TabTrigger value="all">
              {dictionary.components.notificationGrid?.all} ({notificationCounts.all})
            </TabTrigger>
            {platforms.map(platform => (
              <TabTrigger key={platform} value={platform}>
                {platform} ({notificationCounts[platform]})
              </TabTrigger>
            ))}
          </TabList>
          <div className="mt-4">
            <TabContent value="all" className="overflow-auto max-h-[70vh]">
              {renderGridWithActions(modifiedNotifications)}
            </TabContent>
            {platforms.map(platform => (
              <TabContent key={platform} value={platform} className="overflow-auto max-h-[70vh]">
                {renderGridWithActions(
                  modifiedNotifications.filter(notification => notification.platform === platform)
                )}
              </TabContent>
            ))}
          </div>
        </Tabs.Root>
      ) : (
        renderGridWithActions(modifiedNotifications)
      )}
    </div>
  );
};
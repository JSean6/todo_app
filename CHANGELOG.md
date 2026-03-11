## [Unreleased] – Dashboard redesign with categories and calendar (2025-03-07)

### Added

- **Categories**:
  - `category` table in database: `id`, `name`, `user_id`, timestamps
  - `categoryId` column on `task` table (nullable FK to `category`)
  - Categories API: `GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/[id]`, `DELETE /api/categories/[id]`
  - `CategoryForm` component – create new categories inline on dashboard
  - Category selector in task form when adding tasks

- **Calendar / date selector**:
  - `DateSelector` component – horizontal row of selectable date cards (WED 25, THU 26, etc.)
  - Tasks filtered by selected date
  - `GET /api/tasks?date=YYYY-MM-DD` – returns tasks whose `dueAt` falls on that date
  - Default view shows tasks for today

- **Task list UI (replaces table)**:
  - `TaskList` component – list-style layout grouped by category
  - Category section headers (DESIGN, PERSONAL, HOUSE, Uncategorized)
  - Task cards with checkbox, title, description, delete button
  - Styled with MUI (Checkbox, IconButton), shadcn (Card), Tailwind CSS

- **TaskDashboard** client component:
  - Wires `DateSelector`, `TaskForm`, `CategoryForm`, `TaskList`
  - Manages selected date state and fetches tasks by date
  - Fetches categories for the task form
  - Handles refetch on task/category mutations via `onMutate` callbacks

### Changed

- **Database schema**:
  - `task` table: added `category_id` (nullable FK), indexes on `category_id` and `due_at`
  - Drizzle migration: `drizzle/0002_glorious_wolfpack.sql`

- **Tasks API**:
  - `GET`: optional `?date=YYYY-MM-DD` query param to filter by `dueAt` date
  - `GET`: returns `categoryName` (via LEFT JOIN with `category`)
  - `POST`: accepts `categoryId`
  - `PATCH`: accepts `categoryId`; supports partial updates (only updates provided fields)

- **TaskForm**:
  - New props: `categories`, `defaultDueDate`, `onSuccess`
  - Category dropdown (MUI Select)
  - `defaultDueDate` pre-fills due date from selected calendar date
  - Removed completed checkbox from add form

- **Dashboard page** (`/dashboard`):
  - Replaced server-rendered `TaskTable` + `TaskForm` with client `TaskDashboard`
  - Tasks now fetched client-side based on selected date

### Technical notes

- **Styling stack**: Material UI, Tailwind CSS, shadcn (Card, Button)
- **Date handling**: `date-fns` for formatting and date logic
- **Migrations**: Run `npx drizzle-kit migrate` to apply schema changes
- **Neon DB**: Migration applied to Neon project `muddy-resonance-59682716`

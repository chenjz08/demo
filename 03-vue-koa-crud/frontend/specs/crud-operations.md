# Project Dashboard - CRUD Operations Test Plan

## Application Overview
The Project Dashboard is a Vue 3 + Koa full-stack CRUD application for managing project items.
Each item has a **title** (required), **description** (optional), and **status** (active/inactive).
The app provides a table view with inline actions and a modal form for create/edit operations.

## Test Scenarios

### 1. Viewing Item List
**Seed:** `seed.spec.ts`

#### 1.1 Display Initial Items
**Steps:**
1. Navigate to the application root
2. Wait for the data to load

**Expected Results:**
- Page heading "Project Dashboard" is visible
- Table displays pre-existing items from the backend
- Each row shows title, description, status badge, and action buttons (Edit/Delete)
- Active items show green "Active" badge
- Inactive items show amber "Inactive" badge

#### 1.2 Display Empty State
**Steps:**
1. Delete all existing items
2. Observe the empty state

**Expected Results:**
- Message "No items found" is displayed
- "Create First Item" button is visible

### 2. Adding New Items
**Seed:** `seed.spec.ts`

#### 2.1 Add Item with All Fields
**Steps:**
1. Click the "Add New Item" button
2. Fill in Title with "Test New Item"
3. Fill in Description with "This is a test description"
4. Select Status as "Active"
5. Click "Create Item" button

**Expected Results:**
- Modal opens with title "Create New Item"
- After submission, modal closes
- New item "Test New Item" appears in the table
- Item shows "Active" status badge

#### 2.2 Add Item with Title Only
**Steps:**
1. Click the "Add New Item" button
2. Fill in Title with "Title Only Item"
3. Leave Description empty
4. Keep Status as default (Active)
5. Click "Create Item" button

**Expected Results:**
- Modal closes after submission
- New item "Title Only Item" appears in the table
- Description shows "No description provided" or is empty

#### 2.3 Cancel Adding Item
**Steps:**
1. Click the "Add New Item" button
2. Fill in Title with "Should Not Be Created"
3. Click "Cancel" button

**Expected Results:**
- Modal closes
- No new item "Should Not Be Created" appears in the table
- Item count remains unchanged

### 3. Editing Items
**Seed:** `seed.spec.ts`

#### 3.1 Edit Item Title
**Steps:**
1. Click the "Edit" button on the first item
2. Change the Title to "Updated Title"
3. Click "Save Changes" button

**Expected Results:**
- Modal opens with title "Edit Item" and pre-filled data
- After saving, modal closes
- Updated title "Updated Title" is visible in the table

#### 3.2 Edit Item Status
**Steps:**
1. Click the "Edit" button on an active item
2. Change Status to "Inactive"
3. Click "Save Changes" button

**Expected Results:**
- After saving, the item shows amber "Inactive" status badge

#### 3.3 Cancel Editing
**Steps:**
1. Click the "Edit" button on the first item
2. Change the Title to "Modified Title"
3. Click "Cancel" button

**Expected Results:**
- Modal closes
- Original title remains unchanged in the table

### 4. Deleting Items
**Seed:** `seed.spec.ts`

#### 4.1 Confirm Delete Item
**Steps:**
1. Note the current number of items
2. Click the "Delete" button on an item
3. Accept the confirmation dialog

**Expected Results:**
- Browser confirmation dialog appears
- After accepting, the item is removed from the table
- Item count decreases by one

#### 4.2 Cancel Delete Item
**Steps:**
1. Note the current number of items
2. Click the "Delete" button on an item
3. Dismiss the confirmation dialog

**Expected Results:**
- Browser confirmation dialog appears
- After dismissing, the item remains in the table
- Item count remains unchanged

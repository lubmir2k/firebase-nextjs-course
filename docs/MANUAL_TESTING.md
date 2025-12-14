# Fire Homes - Manual Testing Guide

This document provides test cases for all implemented functionality in the Fire Homes application.

## Prerequisites

- Access to the application at `http://localhost:3000`
- A Google account for authentication testing
- Access to Firebase Console for data verification
- Admin email configured in `.env.local` as `ADMIN_EMAIL`

---

## 1. Authentication

### 1.1 Login with Google

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-001 | Access login page when logged out | 1. Ensure logged out<br>2. Navigate to `/login` | Login page displays with "Continue with Google" button |
| AUTH-002 | Login with Google | 1. Click "Continue with Google"<br>2. Select Google account<br>3. Complete Google auth flow | - Google popup appears<br>- After successful auth, redirected to homepage<br>- User avatar appears in navbar |
| AUTH-003 | Login popup cancellation | 1. Click "Continue with Google"<br>2. Close the popup without selecting account | User remains on login page, no errors |

### 1.2 Logout

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-004 | Logout from navbar | 1. Login to app<br>2. Click user avatar<br>3. Click "Logout" | - User logged out<br>- Login/Signup links appear in navbar<br>- Redirected to homepage if on protected route |
| AUTH-005 | Logout from admin dashboard | 1. Login as admin<br>2. Navigate to `/admin-dashboard`<br>3. Click avatar > Logout | Redirected to homepage (not admin dashboard) |

### 1.3 User Dropdown Menu

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-006 | View user info in dropdown | 1. Login<br>2. Click avatar | Dropdown shows:<br>- User display name<br>- User email |
| AUTH-007 | Admin sees Admin Dashboard link | 1. Login with admin account<br>2. Click avatar | "Admin Dashboard" link visible |

---

## 2. Route Protection

### 2.1 Admin Routes Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| ROUTE-001 | Access admin dashboard when logged out | 1. Logout<br>2. Navigate to `/admin-dashboard` | Redirected to homepage |
| ROUTE-002 | Access admin dashboard as non-admin | 1. Login with non-admin account<br>2. Navigate to `/admin-dashboard` | Redirected to homepage |
| ROUTE-003 | Access admin dashboard as admin | 1. Login with admin account<br>2. Navigate to `/admin-dashboard` | Admin dashboard loads successfully |
| ROUTE-004 | Access new property page when logged out | 1. Logout<br>2. Navigate to `/admin-dashboard/new` | Redirected to homepage |
| ROUTE-005 | Access edit property page when logged out | 1. Logout<br>2. Navigate to `/admin-dashboard/edit/[any-id]` | Redirected to homepage |

### 2.2 Login Route Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| ROUTE-006 | Access login page when logged in | 1. Login<br>2. Navigate to `/login` | Redirected to homepage |
| ROUTE-007 | Access login page when logged out | 1. Logout<br>2. Navigate to `/login` | Login page displays normally |

---

## 3. Admin Dashboard

### 3.1 Dashboard Overview

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| DASH-001 | View dashboard with no properties | 1. Login as admin<br>2. Delete all properties from Firebase<br>3. Navigate to `/admin-dashboard` | Message "You have no properties" displays |
| DASH-002 | View dashboard with properties | 1. Login as admin<br>2. Ensure properties exist<br>3. Navigate to `/admin-dashboard` | Properties table displays with all properties |
| DASH-003 | Breadcrumbs display | 1. Navigate to `/admin-dashboard` | Breadcrumb shows "Dashboard" |
| DASH-004 | New Property button | 1. Navigate to `/admin-dashboard`<br>2. Click "New Property" button | Navigates to `/admin-dashboard/new` |

### 3.2 Properties Table

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TABLE-001 | Table columns display | 1. View properties table | Columns: Address, Listing Price, Status, Actions |
| TABLE-002 | Address formatting | 1. View property row | Address shows: address1, address2 (if exists), city, postcode separated by commas |
| TABLE-003 | Price formatting | 1. View property with price 500000 | Displays as "£500,000" with comma separators |
| TABLE-004 | Status badge - For Sale | 1. View property with "for-sale" status | Blue badge with "For Sale" text |
| TABLE-005 | Status badge - Draft | 1. View property with "draft" status | Gray/secondary badge with "Draft" text |
| TABLE-006 | Status badge - Withdrawn | 1. View property with "withdrawn" status | Red/destructive badge with "Withdrawn" text |
| TABLE-007 | Status badge - Sold | 1. View property with "sold" status | Green/success badge with "Sold" text |
| TABLE-008 | Edit button | 1. Click pencil icon on property row | Navigates to `/admin-dashboard/edit/[id]` |

### 3.3 Pagination

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PAGE-001 | Pagination buttons display | 1. Have more properties than page size (10)<br>2. View dashboard | Pagination buttons appear in table footer |
| PAGE-002 | Navigate to page 2 | 1. Click page "2" button | - URL updates to `?page=2`<br>- Table shows page 2 properties |
| PAGE-003 | Active page state | 1. Navigate to page 2 | Page "2" button is disabled/highlighted |
| PAGE-004 | Navigate back to page 1 | 1. From page 2, click page "1" | - URL updates to `?page=1`<br>- Table shows page 1 properties |
| PAGE-005 | Direct URL pagination | 1. Navigate to `/admin-dashboard?page=2` | Page 2 properties display |

---

## 4. Create Property

### 4.1 New Property Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| NEW-001 | Page layout | 1. Navigate to `/admin-dashboard/new` | - Breadcrumbs: Dashboard > New Property<br>- Card with "New Property" title<br>- Form with all fields |
| NEW-002 | Breadcrumb navigation | 1. Click "Dashboard" in breadcrumbs | Navigates back to `/admin-dashboard` |

### 4.2 Property Form Fields

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FORM-001 | Status field | 1. Click Status dropdown | Options: Draft, For Sale, Withdrawn, Sold |
| FORM-002 | Status default value | 1. Load new property form | Status defaults to "Draft" |
| FORM-003 | All form fields present | 1. View form | Fields: Status, Address Line 1, Address Line 2, City, Postcode, Price, Bedrooms, Bathrooms, Description |
| FORM-004 | Number fields | 1. Check Price, Bedrooms, Bathrooms inputs | Input type is "number" |
| FORM-005 | Description textarea | 1. View description field | Textarea with 5 rows, no resize |

### 4.3 Form Validation

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| VAL-001 | Empty Address Line 1 | 1. Leave Address Line 1 empty<br>2. Submit form | Error: "Address line 1 must contain a value" |
| VAL-002 | Short city name | 1. Enter "AB" in City<br>2. Submit form | Error: "City must contain at least 3 characters" |
| VAL-003 | Invalid UK postcode | 1. Enter "12345" in Postcode<br>2. Submit form | Error: "Invalid UK postcode" |
| VAL-004 | Valid UK postcode | 1. Enter "CF24 4AA" in Postcode<br>2. Fill other required fields<br>3. Submit | Postcode validation passes |
| VAL-005 | Zero or negative price | 1. Enter "0" or "-100" in Price<br>2. Submit form | Error: "Price must be greater than zero" |
| VAL-006 | Short description | 1. Enter less than 40 characters in Description<br>2. Submit form | Error: "Description must contain at least 40 characters" |
| VAL-007 | Negative bedrooms/bathrooms | 1. Enter "-1" in Bedrooms or Bathrooms<br>2. Submit form | Error: "Bedrooms/Bathrooms must be at least 0" |
| VAL-008 | Optional Address Line 2 | 1. Leave Address Line 2 empty<br>2. Fill all other required fields<br>3. Submit | Form submits successfully |

### 4.4 Form Submission

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SUB-001 | Successful creation | 1. Fill all fields with valid data<br>2. Click "Create Property" | - Form fields disabled during submission<br>- Success toast appears<br>- Redirected to `/admin-dashboard`<br>- New property appears in table |
| SUB-002 | Form disabled during submit | 1. Submit valid form<br>2. Observe form state | All fields and button are disabled while submitting |
| SUB-003 | Success toast | 1. Successfully create property | Green toast: "Success" with "Property created" description |
| SUB-004 | Verify in Firebase | 1. Create property<br>2. Check Firebase Firestore | Document exists in "properties" collection with all fields + created/updated timestamps |

---

## 5. Edit Property

### 5.1 Edit Property Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EDIT-001 | Page layout | 1. Navigate to edit page for existing property | - Breadcrumbs: Dashboard > Edit Property<br>- Card with "Edit Property" title<br>- Form pre-filled with property data |
| EDIT-002 | Default values loaded | 1. Open edit page for property | All fields populated with existing property data |
| EDIT-003 | Breadcrumb navigation | 1. Click "Dashboard" in breadcrumbs | Navigates back to `/admin-dashboard` |

### 5.2 Edit Form Submission

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EDIT-004 | Update property | 1. Change Address Line 1 to new value<br>2. Click "Save Property" | - Success toast appears<br>- Redirected to dashboard<br>- Updated value shows in table |
| EDIT-005 | Update price | 1. Change price<br>2. Submit form<br>3. View table | New price displays with proper formatting |
| EDIT-006 | Update status | 1. Change status from Draft to For Sale<br>2. Submit | Badge updates to blue "For Sale" |
| EDIT-007 | Form disabled during submit | 1. Submit edit form<br>2. Observe form state | All fields and button disabled during submission |
| EDIT-008 | Success toast | 1. Successfully update property | Green toast: "Success" with "Property updated" description |
| EDIT-009 | Verify in Firebase | 1. Update property<br>2. Check Firebase Firestore | - Document updated with new values<br>- "updated" timestamp changed<br>- "created" timestamp unchanged |

### 5.3 Validation on Edit

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EDIT-010 | Clear required field | 1. Clear Address Line 1<br>2. Try to submit | Validation error appears, form not submitted |

---

## 6. Image Upload

### 6.1 Upload Button and File Selection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-001 | Upload button displays | 1. Navigate to new/edit property form | "Upload Images" button visible with full width, outline style |
| IMG-002 | File picker opens | 1. Click "Upload Images" button | Native OS file picker opens |
| IMG-003 | Select single image | 1. Click "Upload Images"<br>2. Select one image file<br>3. Click Open | Image appears in list below button |
| IMG-004 | Select multiple images | 1. Click "Upload Images"<br>2. Select multiple image files<br>3. Click Open | All selected images appear in list |
| IMG-005 | File type restriction | 1. Click "Upload Images"<br>2. Try to select non-image file | File picker only shows image files (image/*) |
| IMG-006 | Cancel file picker | 1. Click "Upload Images"<br>2. Close file picker without selecting | No changes to image list |

### 6.2 Image List Display

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-007 | Image thumbnail | 1. Upload an image | 64x64px thumbnail displays with object-cover |
| IMG-008 | Image label | 1. Upload multiple images | Labels show "Image 1", "Image 2", etc. |
| IMG-009 | Featured image badge | 1. Upload images | First image shows green "Featured Image" badge |
| IMG-010 | Delete button | 1. View uploaded image | Red X button visible on each image row |
| IMG-011 | Move handle | 1. View uploaded image | Gray move icon visible on each image row |
| IMG-012 | Gray background styling | 1. View image list | Each row has light gray background with rounded corners |

### 6.3 Image Deletion

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-013 | Delete image from list | 1. Upload images<br>2. Click X button on an image | Image removed from list immediately |
| IMG-014 | Delete updates numbering | 1. Upload 3 images<br>2. Delete "Image 2" | Remaining images renumber to "Image 1", "Image 2" |
| IMG-015 | Delete featured image | 1. Upload images<br>2. Delete first image | Second image becomes "Image 1" with Featured badge |
| IMG-016 | Delete all images | 1. Upload images<br>2. Delete all one by one | Image list empty, only "Upload Images" button visible |

### 6.4 Drag and Drop Reordering

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-017 | Drag image down | 1. Upload 3+ images<br>2. Drag "Image 1" to position 3 | Image moves to new position, labels update |
| IMG-018 | Drag image up | 1. Upload 3+ images<br>2. Drag "Image 3" to position 1 | Image moves to new position, becomes Featured |
| IMG-019 | Featured badge updates | 1. Upload images<br>2. Drag Image 2 to position 1 | Dragged image gets Featured badge, original loses it |
| IMG-020 | Drag outside list | 1. Start dragging image<br>2. Drop outside the list area | Image returns to original position |
| IMG-021 | List height maintained | 1. Start dragging an image | List maintains height (no jumping), placeholder visible |

### 6.5 New Property with Images

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-022 | Create with images | 1. Fill property form<br>2. Upload 3 images<br>3. Click "Create Property" | - Success toast<br>- Redirected to dashboard |
| IMG-023 | Verify Storage upload | 1. Create property with images<br>2. Check Firebase Storage | Images exist in `properties/{propertyId}/` folder |
| IMG-024 | Verify Firestore paths | 1. Create property with images<br>2. Check Firestore document | `images` array contains paths to uploaded files |
| IMG-025 | Create without images | 1. Fill property form (no images)<br>2. Submit | Property created successfully, no images field or empty array |

### 6.6 Edit Property - Existing Images

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-026 | Load existing images | 1. Edit property with uploaded images | All images display with thumbnails from Firebase Storage |
| IMG-027 | Existing image thumbnails | 1. Edit property with images | Thumbnails load from firebasestorage.googleapis.com |
| IMG-028 | Add to existing images | 1. Edit property with 2 images<br>2. Upload 1 more image<br>3. Save | Property now has 3 images |
| IMG-029 | Delete existing image | 1. Edit property with images<br>2. Delete one image<br>3. Save | - Image removed from Firestore array<br>- File deleted from Storage |
| IMG-030 | Reorder existing images | 1. Edit property with images<br>2. Reorder via drag<br>3. Save | New order persisted in Firestore |
| IMG-031 | Mixed operations | 1. Edit property<br>2. Delete one image<br>3. Add new image<br>4. Reorder<br>5. Save | All changes persist correctly |

### 6.7 Firebase Storage Verification

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-032 | Storage folder structure | 1. Upload images to property<br>2. Check Storage | Files in `properties/{propertyId}/` |
| IMG-033 | File naming | 1. Upload image<br>2. Check Storage | Filename: `{uuid}-{originalName}` |
| IMG-034 | File deletion | 1. Delete image from property<br>2. Check Storage | File no longer exists in Storage bucket |
| IMG-035 | Multiple properties isolation | 1. Create 2 properties with images | Each property has separate folder in Storage |

---

## 7. UI Components

### 7.1 Navbar

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| NAV-001 | Logo displays | 1. View any page | "Fire Homes" text with home icon |
| NAV-002 | Logo navigation | 1. Click logo | Navigates to homepage |
| NAV-003 | Logged out state | 1. Logout<br>2. View navbar | Shows "Login" and "Sign Up" links with vertical separator |
| NAV-004 | Logged in state | 1. Login<br>2. View navbar | User avatar replaces login/signup links |

### 7.2 Toast Notifications

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TOAST-001 | Success toast appearance | 1. Create or update property | - Toast appears in bottom-right<br>- Green background<br>- Has close button |
| TOAST-002 | Toast close button | 1. Trigger toast<br>2. Click X button | Toast closes immediately |
| TOAST-003 | Toast auto-dismiss | 1. Trigger toast<br>2. Wait | Toast auto-dismisses after a few seconds |

### 7.3 Cards

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CARD-001 | Login card | 1. View `/login` | Card with header "Login" and Google button |
| CARD-002 | Property form cards | 1. View new/edit property pages | Card with appropriate title and form content |

### 7.4 Buttons

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| BTN-001 | Primary button style | 1. View "Create Property" button | Sky blue background, white text, uppercase, wide tracking |
| BTN-002 | Outline button style | 1. View pagination buttons | Border outline, no fill |
| BTN-003 | Disabled button state | 1. Submit form<br>2. Observe button | Button appears disabled (grayed out, not clickable) |

---

## 8. Server Actions Security

### 8.1 Authentication Checks

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEC-001 | Create without auth | 1. Logout<br>2. Attempt to call createProperty directly (via dev tools) | Returns error or fails silently |
| SEC-002 | Update without auth | 1. Logout<br>2. Attempt to call updateProperty directly | Returns error or fails silently |
| SEC-003 | Non-admin create | 1. Login as non-admin<br>2. Try to access new property page | Redirected by middleware |

---

## 9. Cross-Browser Testing

| Test ID | Browser | Test Case | Expected Result |
|---------|---------|-----------|-----------------|
| BROWSER-001 | Chrome | Complete user flow | All features work correctly |
| BROWSER-002 | Firefox | Complete user flow | All features work correctly |
| BROWSER-003 | Safari | Complete user flow | All features work correctly |
| BROWSER-004 | Edge | Complete user flow | All features work correctly |

---

## 10. Responsive Testing

| Test ID | Viewport | Test Case | Expected Result |
|---------|----------|-----------|-----------------|
| RESP-001 | Desktop (1920px) | View all pages | Layout displays correctly |
| RESP-002 | Tablet (768px) | View all pages | Layout adapts appropriately |
| RESP-003 | Mobile (375px) | View all pages | Layout adapts, no horizontal scroll |

---

## Test Data

### Valid Test Property

```
Status: For Sale
Address Line 1: 123 Test Street
Address Line 2: Apartment 4B
City: Cardiff
Postcode: CF24 4AA
Price: 250000
Bedrooms: 3
Bathrooms: 2
Description: This is a beautiful test property with amazing views and modern amenities throughout. Perfect for families.
```

### Valid UK Postcodes for Testing

- CF24 4AA (Cardiff)
- SW1A 1AA (London)
- M1 1AE (Manchester)
- B1 1AA (Birmingham)
- EH1 1AA (Edinburgh)

---

## Bug Reporting Template

When reporting bugs, please include:

1. **Test ID**: (e.g., AUTH-001)
2. **Summary**: Brief description of the issue
3. **Steps to Reproduce**: Numbered list of steps
4. **Expected Result**: What should happen
5. **Actual Result**: What actually happened
6. **Screenshots/Videos**: If applicable
7. **Browser/OS**: e.g., Chrome 120 / macOS Sonoma
8. **Console Errors**: Any JavaScript errors from browser dev tools

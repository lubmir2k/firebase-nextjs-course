# Fire Homes - Manual Testing Guide

This document provides test cases for all implemented functionality in the Fire Homes application.

## Prerequisites

- Access to the application at `http://localhost:3000` or deployed URL
- Email account for registration and login testing
- (Optional) Google account for Google OAuth testing
- Access to Firebase Console for data verification
- Admin email configured in `.env.local` as `ADMIN_EMAIL`

---

## 1. Homepage

### 1.1 Landing Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| HOME-001 | Hero image displays | 1. Navigate to `/` | Full-screen hero image with dark overlay |
| HOME-002 | Heading displays | 1. View homepage | "Find your new home with Fire Homes" heading in white text |
| HOME-003 | Search button displays | 1. View homepage | "Search Properties" button with search icon |
| HOME-004 | Search button navigation | 1. Click "Search Properties" | Navigates to `/property-search` |
| HOME-005 | Navbar visible | 1. View homepage | Fire Homes logo and navigation links visible |

---

## 2. Authentication

### 2.1 Login with Email/Password

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-001 | Access login page when logged out | 1. Ensure logged out<br>2. Navigate to `/login` | Login page displays with email/password form and "Continue with Google" button |
| AUTH-002 | Login form fields | 1. View login page | Form shows Email and Password input fields with Login button |
| AUTH-003 | Empty email validation | 1. Leave email empty<br>2. Enter password<br>3. Click Login | Error: "Invalid email" |
| AUTH-004 | Invalid email format | 1. Enter "notanemail"<br>2. Enter password<br>3. Click Login | Error: "Invalid email" |
| AUTH-005 | Empty password validation | 1. Enter valid email<br>2. Leave password empty<br>3. Click Login | Error: "Password is required." |
| AUTH-006 | Invalid credentials | 1. Enter valid email<br>2. Enter wrong password<br>3. Click Login | Error toast: "Incorrect credentials" |
| AUTH-007 | Successful login | 1. Enter valid email<br>2. Enter correct password<br>3. Click Login | - Page refreshes<br>- User avatar appears in navbar<br>- Redirected appropriately |
| AUTH-008 | Form disabled during submit | 1. Enter valid credentials<br>2. Click Login<br>3. Observe form | All fields and button disabled during submission |
| AUTH-009 | Forgot password link | 1. View login page | "Reset it here" link visible, navigates to `/forgot-password` |
| AUTH-010 | Register link | 1. View login page footer | "Register here" link visible, navigates to `/register` |

### 2.2 Login with Google

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-011 | Google button displays | 1. View login page | "Continue with Google" button visible below the form |
| AUTH-012 | Login with Google | 1. Click "Continue with Google"<br>2. Select Google account<br>3. Complete Google auth flow | - Google popup appears<br>- After successful auth, page refreshes<br>- User avatar appears in navbar |
| AUTH-013 | Google popup cancellation | 1. Click "Continue with Google"<br>2. Close the popup without selecting account | User remains on login page, no errors |

### 2.3 Logout

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-014 | Logout from navbar | 1. Login to app<br>2. Click user avatar<br>3. Click "Logout" | - User logged out<br>- Login/Sign Up links appear in navbar<br>- Redirected to homepage if on protected route |
| AUTH-015 | Logout from admin dashboard | 1. Login as admin<br>2. Navigate to `/admin-dashboard`<br>3. Click avatar > Logout | Redirected to homepage (not admin dashboard) |

### 2.4 User Dropdown Menu

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-016 | View user info in dropdown | 1. Login<br>2. Click avatar | Dropdown shows:<br>- User name (from registration or Google)<br>- User email |
| AUTH-017 | Admin sees Admin Dashboard link | 1. Login with admin account<br>2. Click avatar | "Admin Dashboard" link visible |
| AUTH-018 | Non-admin sees My Account link | 1. Login with non-admin account<br>2. Click avatar | "My Account" and "My Favourites" links visible |

### 2.5 Token Refresh

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| AUTH-019 | Token refresh on expiring token | 1. Login as admin<br>2. Wait until token is within 5 minutes of expiry (or manually edit cookie expiry in dev tools)<br>3. Navigate to `/admin-dashboard` | - Redirected to `/api/refresh-token?redirect=/admin-dashboard`<br>- New token obtained silently<br>- Redirected back to `/admin-dashboard` |
| AUTH-020 | Refresh with invalid refresh token | 1. Login as admin<br>2. Manually delete or corrupt `firebaseAuthRefreshToken` cookie in dev tools<br>3. Set `firebaseAuthToken` to an expired token<br>4. Navigate to `/admin-dashboard` | Redirected to homepage |
| AUTH-021 | Refresh preserves redirect path | 1. Login as admin<br>2. Set token to near-expiry<br>3. Navigate to `/admin-dashboard/edit/[property-id]` | After refresh, redirected to the same edit page (not homepage or dashboard) |
| AUTH-022 | Refresh without redirect param | 1. Directly navigate to `/api/refresh-token` (no redirect param) | Redirected to homepage |
| AUTH-023 | Expired token without refresh token | 1. Delete `firebaseAuthRefreshToken` cookie<br>2. Wait for `firebaseAuthToken` to expire<br>3. Navigate to protected route | - Both cookies deleted<br>- Redirected to homepage |
| AUTH-024 | Cookies updated after refresh | 1. Trigger token refresh (token near expiry)<br>2. Check cookies in dev tools after redirect | Both `firebaseAuthToken` and `firebaseAuthRefreshToken` have new values |

> **Testing Tip:** To test token refresh without waiting, you can use browser dev tools:
> 1. Open Application > Cookies
> 2. Decode the `firebaseAuthToken` JWT at [jwt.io](https://jwt.io)
> 3. Note the `exp` claim (expiration timestamp)
> 4. The middleware triggers refresh when token expires within 300 seconds (5 minutes)
> 5. Alternatively, create a test endpoint that issues short-lived tokens for testing

---

## 3. Registration

### 3.1 Registration Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| REG-001 | Access registration page | 1. Navigate to `/register` | Registration page displays with form |
| REG-002 | Form fields display | 1. View registration page | Fields: Your name, Email, Password, Confirm password, Register button |
| REG-003 | Login link | 1. View registration page footer | "Log in here" link visible, navigates to `/login` |
| REG-004 | Google button displays | 1. View registration page | "Continue with Google" button visible below the form |

### 3.2 Registration Form Validation

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| REG-005 | Short name rejected | 1. Enter "A" in name field<br>2. Fill other fields<br>3. Submit | Error: "Name must be at least 2 characters" |
| REG-006 | Invalid email format | 1. Enter "notanemail"<br>2. Fill other fields<br>3. Submit | Error: "Invalid email" |
| REG-007 | Weak password - too short | 1. Enter "Ab1!" (less than 6 chars)<br>2. Submit | Error about password requirements |
| REG-008 | Weak password - no uppercase | 1. Enter "abcdef1!" (no uppercase)<br>2. Submit | Error: "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character" |
| REG-009 | Weak password - no lowercase | 1. Enter "ABCDEF1!" (no lowercase)<br>2. Submit | Error about password requirements |
| REG-010 | Weak password - no number | 1. Enter "Abcdef!" (no number)<br>2. Submit | Error about password requirements |
| REG-011 | Weak password - no special char | 1. Enter "Abcdef1" (no special char)<br>2. Submit | Error about password requirements |
| REG-012 | Password mismatch | 1. Enter "ValidPass1!" as password<br>2. Enter "DifferentPass1!" as confirm<br>3. Submit | Error: "Passwords do not match" |
| REG-013 | Valid password accepted | 1. Enter "ValidPass1!" for both password fields<br>2. Fill other fields correctly<br>3. Submit | No password validation errors |

### 3.3 Registration Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| REG-014 | Successful registration | 1. Fill all fields with valid data<br>2. Click Register | - Success toast: "Your account was created successfully!"<br>- Redirected to `/login` |
| REG-015 | Form disabled during submit | 1. Fill valid data<br>2. Click Register<br>3. Observe form | All fields and button disabled during submission |
| REG-016 | Email already exists | 1. Register with email that exists<br>2. Submit | Error toast with appropriate message |
| REG-017 | Can login after registration | 1. Register successfully<br>2. Navigate to login<br>3. Login with new credentials | Login succeeds |
| REG-018 | Verify in Firebase Auth | 1. Register new user<br>2. Check Firebase Console > Authentication | New user appears in users list |

### 3.4 Registration Route Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| REG-019 | Logged in user redirected | 1. Login<br>2. Navigate to `/register` | Redirected to homepage |

---

## 4. Route Protection

### 4.1 Admin Routes Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| ROUTE-001 | Access admin dashboard when logged out | 1. Logout<br>2. Navigate to `/admin-dashboard` | Redirected to homepage |
| ROUTE-002 | Access admin dashboard as non-admin | 1. Login with non-admin account<br>2. Navigate to `/admin-dashboard` | Redirected to homepage |
| ROUTE-003 | Access admin dashboard as admin | 1. Login with admin account<br>2. Navigate to `/admin-dashboard` | Admin dashboard loads successfully |
| ROUTE-004 | Access new property page when logged out | 1. Logout<br>2. Navigate to `/admin-dashboard/new` | Redirected to homepage |
| ROUTE-005 | Access edit property page when logged out | 1. Logout<br>2. Navigate to `/admin-dashboard/edit/[any-id]` | Redirected to homepage |

### 4.2 Login Route Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| ROUTE-006 | Access login page when logged in | 1. Login<br>2. Navigate to `/login` | Redirected to homepage |
| ROUTE-007 | Access login page when logged out | 1. Logout<br>2. Navigate to `/login` | Login page displays normally |

### 4.3 Forgot Password Route Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| ROUTE-008 | Access forgot password when logged in | 1. Login<br>2. Navigate to `/forgot-password` | Redirected to homepage |
| ROUTE-009 | Access forgot password when logged out | 1. Logout<br>2. Navigate to `/forgot-password` | Forgot password page displays normally |

---

## 5. Admin Dashboard

### 5.1 Dashboard Overview

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| DASH-001 | View dashboard with no properties | 1. Login as admin<br>2. Delete all properties from Firebase<br>3. Navigate to `/admin-dashboard` | Message "You have no properties" displays |
| DASH-002 | View dashboard with properties | 1. Login as admin<br>2. Ensure properties exist<br>3. Navigate to `/admin-dashboard` | Properties table displays with all properties |
| DASH-003 | Breadcrumbs display | 1. Navigate to `/admin-dashboard` | Breadcrumb shows "Dashboard" |
| DASH-004 | New Property button | 1. Navigate to `/admin-dashboard`<br>2. Click "New Property" button | Navigates to `/admin-dashboard/new` |

### 5.2 Properties Table

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

### 5.3 Pagination

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PAGE-001 | Pagination buttons display | 1. Have more properties than page size (10)<br>2. View dashboard | Pagination buttons appear in table footer |
| PAGE-002 | Navigate to page 2 | 1. Click page "2" button | - URL updates to `?page=2`<br>- Table shows page 2 properties |
| PAGE-003 | Active page state | 1. Navigate to page 2 | Page "2" button is disabled/highlighted |
| PAGE-004 | Navigate back to page 1 | 1. From page 2, click page "1" | - URL updates to `?page=1`<br>- Table shows page 1 properties |
| PAGE-005 | Direct URL pagination | 1. Navigate to `/admin-dashboard?page=2` | Page 2 properties display |

---

## 6. Create Property

### 6.1 New Property Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| NEW-001 | Page layout | 1. Navigate to `/admin-dashboard/new` | - Breadcrumbs: Dashboard > New Property<br>- Card with "New Property" title<br>- Form with all fields |
| NEW-002 | Breadcrumb navigation | 1. Click "Dashboard" in breadcrumbs | Navigates back to `/admin-dashboard` |

### 6.2 Property Form Fields

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FORM-001 | Status field | 1. Click Status dropdown | Options: Draft, For Sale, Withdrawn, Sold |
| FORM-002 | Status default value | 1. Load new property form | Status defaults to "Draft" |
| FORM-003 | All form fields present | 1. View form | Fields: Status, Address Line 1, Address Line 2, City, Postcode, Price, Bedrooms, Bathrooms, Description |
| FORM-004 | Number fields | 1. Check Price, Bedrooms, Bathrooms inputs | Input type is "number" |
| FORM-005 | Description textarea | 1. View description field | Textarea with 5 rows, no resize |

### 6.3 Form Validation

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

### 6.4 Form Submission

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SUB-001 | Successful creation | 1. Fill all fields with valid data<br>2. Click "Create Property" | - Form fields disabled during submission<br>- Success toast appears<br>- Redirected to `/admin-dashboard`<br>- New property appears in table |
| SUB-002 | Form disabled during submit | 1. Submit valid form<br>2. Observe form state | All fields and button are disabled while submitting |
| SUB-003 | Success toast | 1. Successfully create property | Green toast: "Success" with "Property created" description |
| SUB-004 | Verify in Firebase | 1. Create property<br>2. Check Firebase Firestore | Document exists in "properties" collection with all fields + created/updated timestamps |

---

## 7. Edit Property

### 7.1 Edit Property Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EDIT-001 | Page layout | 1. Navigate to edit page for existing property | - Breadcrumbs: Dashboard > Edit Property<br>- Card with "Edit Property" title<br>- Form pre-filled with property data |
| EDIT-002 | Default values loaded | 1. Open edit page for property | All fields populated with existing property data |
| EDIT-003 | Breadcrumb navigation | 1. Click "Dashboard" in breadcrumbs | Navigates back to `/admin-dashboard` |

### 7.2 Edit Form Submission

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EDIT-004 | Update property | 1. Change Address Line 1 to new value<br>2. Click "Save Property" | - Success toast appears<br>- Redirected to dashboard<br>- Updated value shows in table |
| EDIT-005 | Update price | 1. Change price<br>2. Submit form<br>3. View table | New price displays with proper formatting |
| EDIT-006 | Update status | 1. Change status from Draft to For Sale<br>2. Submit | Badge updates to blue "For Sale" |
| EDIT-007 | Form disabled during submit | 1. Submit edit form<br>2. Observe form state | All fields and button disabled during submission |
| EDIT-008 | Success toast | 1. Successfully update property | Green toast: "Success" with "Property updated" description |
| EDIT-009 | Verify in Firebase | 1. Update property<br>2. Check Firebase Firestore | - Document updated with new values<br>- "updated" timestamp changed<br>- "created" timestamp unchanged |

### 7.3 Validation on Edit

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| EDIT-010 | Clear required field | 1. Clear Address Line 1<br>2. Try to submit | Validation error appears, form not submitted |

---

## 8. Image Upload

### 8.1 Upload Button and File Selection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-001 | Upload button displays | 1. Navigate to new/edit property form | "Upload Images" button visible with full width, outline style |
| IMG-002 | File picker opens | 1. Click "Upload Images" button | Native OS file picker opens |
| IMG-003 | Select single image | 1. Click "Upload Images"<br>2. Select one image file<br>3. Click Open | Image appears in list below button |
| IMG-004 | Select multiple images | 1. Click "Upload Images"<br>2. Select multiple image files<br>3. Click Open | All selected images appear in list |
| IMG-005 | File type restriction | 1. Click "Upload Images"<br>2. Try to select non-image file | File picker only shows image files (image/*) |
| IMG-006 | Cancel file picker | 1. Click "Upload Images"<br>2. Close file picker without selecting | No changes to image list |

### 8.2 Image List Display

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-007 | Image thumbnail | 1. Upload an image | 64x64px thumbnail displays with object-cover |
| IMG-008 | Image label | 1. Upload multiple images | Labels show "Image 1", "Image 2", etc. |
| IMG-009 | Featured image badge | 1. Upload images | First image shows green "Featured Image" badge |
| IMG-010 | Delete button | 1. View uploaded image | Red X button visible on each image row |
| IMG-011 | Move handle | 1. View uploaded image | Gray move icon visible on each image row |
| IMG-012 | Gray background styling | 1. View image list | Each row has light gray background with rounded corners |

### 8.3 Image Deletion

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-013 | Delete image from list | 1. Upload images<br>2. Click X button on an image | Image removed from list immediately |
| IMG-014 | Delete updates numbering | 1. Upload 3 images<br>2. Delete "Image 2" | Remaining images renumber to "Image 1", "Image 2" |
| IMG-015 | Delete featured image | 1. Upload images<br>2. Delete first image | Second image becomes "Image 1" with Featured badge |
| IMG-016 | Delete all images | 1. Upload images<br>2. Delete all one by one | Image list empty, only "Upload Images" button visible |

### 8.4 Drag and Drop Reordering

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-017 | Drag image down | 1. Upload 3+ images<br>2. Drag "Image 1" to position 3 | Image moves to new position, labels update |
| IMG-018 | Drag image up | 1. Upload 3+ images<br>2. Drag "Image 3" to position 1 | Image moves to new position, becomes Featured |
| IMG-019 | Featured badge updates | 1. Upload images<br>2. Drag Image 2 to position 1 | Dragged image gets Featured badge, original loses it |
| IMG-020 | Drag outside list | 1. Start dragging image<br>2. Drop outside the list area | Image returns to original position |
| IMG-021 | List height maintained | 1. Start dragging an image | List maintains height (no jumping), placeholder visible |

### 8.5 New Property with Images

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-022 | Create with images | 1. Fill property form<br>2. Upload 3 images<br>3. Click "Create Property" | - Success toast<br>- Redirected to dashboard |
| IMG-023 | Verify Storage upload | 1. Create property with images<br>2. Check Firebase Storage | Images exist in `properties/{propertyId}/` folder |
| IMG-024 | Verify Firestore paths | 1. Create property with images<br>2. Check Firestore document | `images` array contains paths to uploaded files |
| IMG-025 | Create without images | 1. Fill property form (no images)<br>2. Submit | Property created successfully, no images field or empty array |

### 8.6 Edit Property - Existing Images

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-026 | Load existing images | 1. Edit property with uploaded images | All images display with thumbnails from Firebase Storage |
| IMG-027 | Existing image thumbnails | 1. Edit property with images | Thumbnails load from firebasestorage.googleapis.com |
| IMG-028 | Add to existing images | 1. Edit property with 2 images<br>2. Upload 1 more image<br>3. Save | Property now has 3 images |
| IMG-029 | Delete existing image | 1. Edit property with images<br>2. Delete one image<br>3. Save | - Image removed from Firestore array<br>- File deleted from Storage |
| IMG-030 | Reorder existing images | 1. Edit property with images<br>2. Reorder via drag<br>3. Save | New order persisted in Firestore |
| IMG-031 | Mixed operations | 1. Edit property<br>2. Delete one image<br>3. Add new image<br>4. Reorder<br>5. Save | All changes persist correctly |

### 8.7 Firebase Storage Verification

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| IMG-032 | Storage folder structure | 1. Upload images to property<br>2. Check Storage | Files in `properties/{propertyId}/` |
| IMG-033 | File naming | 1. Upload image<br>2. Check Storage | Filename: `{uuid}-{originalName}` |
| IMG-034 | File deletion | 1. Delete image from property<br>2. Check Storage | File no longer exists in Storage bucket |
| IMG-035 | Multiple properties isolation | 1. Create 2 properties with images | Each property has separate folder in Storage |

---

## 9. Property Details Page

### 9.1 Page Access

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PROP-001 | Access property page | 1. Navigate to `/property/[valid-id]` | Property details page loads |
| PROP-002 | Invalid property ID | 1. Navigate to `/property/invalid-id-123` | 404 Not Found page |
| PROP-003 | Access from search | 1. Go to property search<br>2. Click "View Property" on a card | Navigates to property detail page |

### 9.2 Image Carousel

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PROP-004 | Carousel displays | 1. View property with images | Image carousel visible on left side |
| PROP-005 | Single image - no arrows | 1. View property with 1 image | Carousel shows image, no navigation arrows |
| PROP-006 | Multiple images - arrows | 1. View property with 2+ images | Previous and Next arrow buttons visible |
| PROP-007 | Navigate carousel | 1. View property with multiple images<br>2. Click Next arrow | Carousel advances to next image |
| PROP-008 | Carousel image sizing | 1. View carousel | Images fill 80vh height with object-cover |
| PROP-009 | Property without images | 1. View property with no images | No carousel section displayed |

### 9.3 Property Information

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PROP-010 | Status badge | 1. View property page | Status badge displays (For Sale, Sold, etc.) |
| PROP-011 | Address display | 1. View property | Full address shown: address1, address2 (if exists), city, postcode |
| PROP-012 | Price display | 1. View property with price 350000 | Displays as "£350,000" with formatting |
| PROP-013 | Bedrooms display | 1. View property | Bed icon with bedroom count visible |
| PROP-014 | Bathrooms display | 1. View property | Bath icon with bathroom count visible |

### 9.4 Description

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PROP-015 | Markdown rendering | 1. Create property with markdown description (bold, lists, etc.)<br>2. View property | Markdown renders correctly as formatted HTML |
| PROP-016 | Description layout | 1. View description section | Description appears below carousel with max-width and padding |

### 9.5 Navigation

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PROP-017 | Back button | 1. Navigate to property from search<br>2. Click Back button | Returns to previous page (property search) |
| PROP-018 | Back button position | 1. View property page | Back button visible in description area |

---

## 10. UI Components

### 10.1 Navbar

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| NAV-001 | Logo displays | 1. View any page | "Fire Homes" text with home icon |
| NAV-002 | Logo navigation | 1. Click logo | Navigates to homepage |
| NAV-003 | Logged out state | 1. Logout<br>2. View navbar | Shows "Login" and "Sign Up" links with vertical separator |
| NAV-004 | Logged in state | 1. Login<br>2. View navbar | User avatar replaces login/signup links |

### 10.2 Toast Notifications

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| TOAST-001 | Success toast appearance | 1. Create or update property | - Toast appears in bottom-right<br>- Green background<br>- Has close button |
| TOAST-002 | Toast close button | 1. Trigger toast<br>2. Click X button | Toast closes immediately |
| TOAST-003 | Toast auto-dismiss | 1. Trigger toast<br>2. Wait | Toast auto-dismisses after a few seconds |
| TOAST-004 | Error toast appearance | 1. Trigger error (e.g., invalid login) | - Toast appears in bottom-right<br>- Red/error styling |

### 10.3 Cards

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| CARD-001 | Login card | 1. View `/login` | Card with header "Login" and email/password form with Google button |
| CARD-002 | Property form cards | 1. View new/edit property pages | Card with appropriate title and form content |

### 10.4 Buttons

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| BTN-001 | Primary button style | 1. View "Create Property" button | Sky blue background, white text, uppercase, wide tracking |
| BTN-002 | Outline button style | 1. View pagination buttons | Border outline, no fill |
| BTN-003 | Disabled button state | 1. Submit form<br>2. Observe button | Button appears disabled (grayed out, not clickable) |

---

## 11. Server Actions Security

### 11.1 Authentication Checks

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEC-001 | Create without auth | 1. Logout<br>2. Attempt to call createProperty directly (via dev tools) | Returns error or fails silently |
| SEC-002 | Update without auth | 1. Logout<br>2. Attempt to call updateProperty directly | Returns error or fails silently |
| SEC-003 | Non-admin create | 1. Login as non-admin<br>2. Try to access new property page | Redirected by middleware |
| SEC-004 | Non-admin update | 1. Login as non-admin<br>2. Try to access edit property page | Redirected by middleware |
| SEC-005 | Tamper with property ID | 1. Login as admin<br>2. Try to update with invalid property ID | Error returned, no data corruption |

---

## 12. Cross-Browser Testing

| Test ID | Browser | Test Case | Expected Result |
|---------|---------|-----------|-----------------|
| BROWSER-001 | Chrome | Complete user flow | All features work correctly |
| BROWSER-002 | Firefox | Complete user flow | All features work correctly |
| BROWSER-003 | Safari | Complete user flow | All features work correctly |
| BROWSER-004 | Edge | Complete user flow | All features work correctly |

---

## 13. Responsive Testing

| Test ID | Viewport | Test Case | Expected Result |
|---------|----------|-----------|-----------------|
| RESP-001 | Desktop (1920px) | View all pages | Layout displays correctly |
| RESP-002 | Tablet (768px) | View all pages | Layout adapts appropriately |
| RESP-003 | Mobile (375px) | View all pages | Layout adapts, no horizontal scroll |

---

## 14. Property Search

### 14.1 Search Page Access

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEARCH-001 | Access search page | Navigate to `/property-search` | Page loads with "Property Search" title and Filters card |
| SEARCH-002 | Filters form displays | View search page | Form shows Min price, Max price, Min bedrooms inputs with labels and Search button |

### 14.2 Search Filters

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEARCH-003 | Filter by min price | 1. Enter 200000 in Min price<br>2. Click Search | URL updates with `minPrice=200000`, only properties >= £200,000 shown |
| SEARCH-004 | Filter by max price | 1. Enter 500000 in Max price<br>2. Click Search | URL updates with `maxPrice=500000`, only properties <= £500,000 shown |
| SEARCH-005 | Filter by min bedrooms | 1. Enter 3 in Min bedrooms<br>2. Click Search | URL updates with `minBedrooms=3`, only properties with 3+ bedrooms shown |
| SEARCH-006 | Multiple filters | 1. Enter min price 100000<br>2. Enter max price 300000<br>3. Enter min bedrooms 2<br>4. Click Search | All filters applied, URL contains all params |
| SEARCH-007 | Clear filters | 1. Apply filters<br>2. Clear all inputs<br>3. Click Search | URL has only `page=1`, all for-sale properties shown |
| SEARCH-008 | Filter persistence on refresh | 1. Apply filters<br>2. Refresh page (F5) | Form inputs retain filter values from URL |
| SEARCH-009 | Only for-sale properties shown | 1. View search results | Only properties with "for-sale" status displayed (no Draft, Sold, Withdrawn) |

### 14.3 Property Results Grid

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEARCH-010 | Grid layout | View results with multiple properties | Properties displayed in 3-column grid |
| SEARCH-011 | Property card with image | View property that has images | Card shows thumbnail image with rounded corners |
| SEARCH-012 | Property card placeholder | View property without images | Card shows HomeIcon with "No Image" text on sky-blue background |
| SEARCH-013 | Property card details | View any property card | Shows: address, bed count with icon, bath count with icon, formatted price |
| SEARCH-014 | Price formatting | View property with price 250000 | Displays as "£250,000" with comma separator |
| SEARCH-015 | View Property button | Click "View Property" on any card | Navigates to `/property/[propertyId]` detail page |
| SEARCH-016 | Empty results | Apply filters that match no properties (e.g., min price 99999999) | Shows "No properties found matching your criteria." message |
| SEARCH-017 | Image alt text | Right-click image > Inspect | Alt attribute contains property address |

### 14.4 Pagination

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEARCH-018 | Pagination buttons display | Have more than 3 for-sale properties | Numbered page buttons appear below grid |
| SEARCH-019 | Current page disabled | View page 1 (default) | Page 1 button is disabled |
| SEARCH-020 | Navigate to page 2 | Click page 2 button | URL updates to `page=2`, page 2 results shown, page 2 button disabled |
| SEARCH-021 | Filters persist with pagination | 1. Apply min price filter<br>2. Click page 2 | URL contains both `minPrice` and `page=2` params |
| SEARCH-022 | Direct URL pagination | Navigate to `/property-search?page=2` | Page 2 results display directly |
| SEARCH-023 | Page size | Count results on a full page | Maximum 3 properties per page |

### 14.5 Firestore Indexes

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| SEARCH-024 | Query with filters works | Apply various filter combinations | No console errors about missing indexes |

> **Note for testers:** If you see Firestore index errors in the console, you need to create composite indexes. Click the link in the error message to create the index in Firebase Console. Required indexes include combinations of `status`, `listingPrice`, and `bedrooms` fields.

---

## 15. Property Favorites

### 15.1 Toggle Favourite Button

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FAV-001 | Favourite button displays | 1. Navigate to `/property-search`<br>2. View property card | Heart icon button visible in top-right corner of card |
| FAV-002 | Add to favourites | 1. Login as non-admin<br>2. Click heart on unfavourited property | - Heart fills with pink color<br>- Success toast: "Property added to favourites" |
| FAV-003 | Remove from favourites | 1. Click heart on favourited property | - Heart becomes white/unfilled<br>- Success toast: "Property removed from favourites" |
| FAV-004 | Favourite state persists | 1. Add property to favourites<br>2. Refresh page | Heart remains filled for favourited property |
| FAV-005 | Admin cannot see favourites | 1. Login as admin<br>2. Navigate to `/property-search` | Heart buttons are NOT visible on property cards |

### 15.2 Login Modal

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FAV-006 | Modal appears for logged out user | 1. Logout<br>2. Navigate to `/property-search`<br>3. Click heart on any property | Login modal dialog appears over property search page |
| FAV-007 | Modal title and description | 1. Trigger login modal | - Title: "Login"<br>- Description: "You must be logged in to favorite a property." |
| FAV-008 | Modal has login form | 1. View login modal | Email, password fields, login button, Google button visible |
| FAV-009 | Modal close on backdrop | 1. Open login modal<br>2. Click outside modal / press X | Modal closes, returns to property search |
| FAV-010 | Login via modal | 1. Open login modal<br>2. Enter valid credentials<br>3. Click Login | - Modal closes<br>- Page refreshes<br>- User logged in |
| FAV-011 | Register link in modal | 1. Open login modal<br>2. Click "Register here" link | Navigates to `/register` page |
| FAV-012 | Favourites visible after login | 1. Login via modal<br>2. View property search | Previously favourited properties show filled hearts |

### 15.3 My Favourites Page

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FAV-013 | Access My Favourites | 1. Login as non-admin<br>2. Navigate to `/account/my-favourites` | Page loads with "My Favourites" title |
| FAV-014 | Empty favourites message | 1. Remove all favourites<br>2. View My Favourites page | Message: "You have no favourited properties." |
| FAV-015 | Favourites table displays | 1. Have at least one favourite<br>2. View My Favourites | Table shows Property (address), Status, and action buttons |
| FAV-016 | Property address format | 1. View favourite in table | Address shows: address1, address2 (if exists), city, postcode |
| FAV-017 | Status badge displays | 1. View favourite with "for-sale" status | Blue "For Sale" badge in Status column |
| FAV-018 | View property button | 1. Click eye icon on favourite | Navigates to `/property/[id]` detail page |
| FAV-019 | Back from property page | 1. Navigate to property from favourites<br>2. Click browser back | Returns to My Favourites page |

### 15.4 Remove from My Favourites

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FAV-020 | Remove favourite | 1. Click trash icon on favourite | - Row removed from table<br>- Success toast: "Property removed from favourites" |
| FAV-021 | Remove updates count | 1. Have 3 favourites on page<br>2. Remove one | Table shows 2 remaining favourites |
| FAV-022 | Remove last favourite | 1. Have 1 favourite<br>2. Remove it | Empty favourites message appears |
| FAV-023 | Error handling | 1. Simulate network error (offline)<br>2. Try to remove favourite | Error toast: "Failed to remove property from favourites" |

### 15.5 My Favourites Pagination

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FAV-024 | Pagination displays | 1. Have 3+ favourites (page size is 2)<br>2. View My Favourites | Pagination buttons appear in table footer |
| FAV-025 | Navigate pages | 1. Click page 2 button | - URL updates to `?page=2`<br>- Page 2 favourites shown |
| FAV-026 | Current page disabled | 1. View page 1 | Page 1 button is disabled |
| FAV-027 | Delete last on page redirect | 1. Have 3 favourites (pages 1 and 2)<br>2. Go to page 2<br>3. Delete the favourite | Redirected to page 1 (last valid page) |

### 15.6 Route Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FAV-028 | My Favourites requires login | 1. Logout<br>2. Navigate to `/account/my-favourites` | Redirected to homepage |
| FAV-029 | Admin cannot access My Favourites | 1. Login as admin<br>2. Navigate to `/account/my-favourites` | Redirected to homepage |

---

## 16. My Account Page

### 16.1 Page Access and Display

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| ACC-001 | Access My Account page | 1. Login with email/password<br>2. Navigate to `/account` | Page loads with "My Account" card |
| ACC-002 | Redirect when logged out | 1. Logout<br>2. Navigate to `/account` | Redirected to homepage |
| ACC-003 | Email display | 1. Login<br>2. View My Account page | User's email address is displayed |
| ACC-004 | Password form visible for password users | 1. Login with email/password<br>2. View My Account | "Update Password" section is visible |
| ACC-005 | Password form hidden for Google users | 1. Login with Google<br>2. View My Account | "Update Password" section is NOT visible |
| ACC-006 | Danger zone visible for non-admin | 1. Login as non-admin<br>2. View My Account | "Danger Zone" with Delete Account button is visible |
| ACC-007 | Danger zone hidden for admin | 1. Login as admin<br>2. View My Account | "Danger Zone" section is NOT visible |

---

## 17. Update Password

### 17.1 Form Display

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PASS-001 | Form fields display | 1. Login with email/password<br>2. View My Account | Form shows: Current Password, New Password, Confirm New Password, Update Password button |
| PASS-002 | Form has border separator | 1. View Update Password section | Section has top border separating it from email |

### 17.2 Form Validation

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PASS-003 | Weak password rejected | 1. Enter current password<br>2. Enter "abc123" as new password<br>3. Submit | Error: "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character" |
| PASS-004 | Password mismatch | 1. Enter valid current password<br>2. Enter "StrongPass1!" as new password<br>3. Enter "DifferentPass1!" as confirm<br>4. Submit | Error: "Passwords do not match" |
| PASS-005 | All fields required | 1. Leave any field empty<br>2. Submit | Validation error for empty field |

### 17.3 Password Update Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| PASS-006 | Wrong current password | 1. Enter incorrect current password<br>2. Enter valid new password<br>3. Submit | Error toast: "Your current password is incorrect" |
| PASS-007 | Successful password update | 1. Enter correct current password<br>2. Enter valid new password and confirm<br>3. Submit | - Success toast: "Password updated successfully"<br>- Form fields are cleared |
| PASS-008 | Can login with new password | 1. Update password successfully<br>2. Logout<br>3. Login with new password | Login succeeds with new password |
| PASS-009 | Form disabled during submit | 1. Fill form with valid data<br>2. Click Update Password<br>3. Observe form | All fields and button disabled during submission |

---

## 18. Delete Account

### 18.1 Confirmation Dialog

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| DEL-001 | Delete button displays | 1. Login as non-admin<br>2. View My Account | Red "Delete Account" button visible in Danger Zone |
| DEL-002 | Confirmation modal opens | 1. Click "Delete Account" button | Alert dialog appears with confirmation message |
| DEL-003 | Modal content | 1. Open delete confirmation | - Title: "Are you sure you want to delete your account?"<br>- Warning text about permanent deletion<br>- Password input field |
| DEL-004 | Cancel button works | 1. Open delete confirmation<br>2. Click "Cancel" | Modal closes, account not deleted |
| DEL-005 | Delete disabled without password | 1. Open delete confirmation<br>2. Leave password empty | "Delete Account" button in modal is disabled |

### 18.2 Account Deletion Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| DEL-006 | Wrong password rejected | 1. Open delete confirmation<br>2. Enter wrong password<br>3. Click Delete Account | Error toast: "Your current password is incorrect" |
| DEL-007 | Successful deletion | 1. Open delete confirmation<br>2. Enter correct password<br>3. Click Delete Account | - Success toast: "Your account was deleted successfully"<br>- User is logged out |
| DEL-008 | Cannot login after deletion | 1. Delete account<br>2. Try to login with deleted credentials | Login fails, account does not exist |
| DEL-009 | Favorites cleaned up | 1. Add some favorites<br>2. Delete account<br>3. Check Firestore | User's favorites document is deleted from Firestore |
| DEL-010 | User removed from Firebase Auth | 1. Delete account<br>2. Check Firebase Auth console | User no longer appears in Authentication users list |

### 18.3 Admin Restriction

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| DEL-011 | Admin cannot see delete button | 1. Login as admin<br>2. Navigate to `/account` | Danger Zone section is not visible |

---

## 19. Forgot Password

### 19.1 Page Access

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FORGOT-001 | Access forgot password page | 1. Logout<br>2. Navigate to `/forgot-password` | Page loads with card containing email form |
| FORGOT-002 | Link from login page | 1. Navigate to `/login`<br>2. Click "Reset it here" link | Navigates to `/forgot-password` page |
| FORGOT-003 | Page layout | 1. View forgot password page | - Card with "Forgot Password" title<br>- Description about reset email<br>- Email input field<br>- "Reset Password" button |

### 19.2 Password Reset Flow

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FORGOT-004 | Submit with valid email | 1. Enter valid registered email<br>2. Click "Reset Password" | - Success toast: "Password reset email sent"<br>- Email field is cleared |
| FORGOT-005 | Check email received | 1. Submit reset for valid email<br>2. Check email inbox | Password reset email from Firebase received |
| FORGOT-006 | Reset link works | 1. Click link in reset email<br>2. Enter new password on Firebase page<br>3. Submit | Password updated, can login with new password |
| FORGOT-007 | Button disabled during submit | 1. Enter email<br>2. Click Reset Password<br>3. Observe button | Button shows "Sending..." and is disabled |
| FORGOT-008 | Invalid email handling | 1. Enter non-registered email<br>2. Click Reset Password | Error toast or Firebase handles silently (security) |

### 19.3 Route Protection

| Test ID | Test Case | Steps | Expected Result |
|---------|-----------|-------|-----------------|
| FORGOT-009 | Logged in user redirected | 1. Login<br>2. Navigate to `/forgot-password` | Redirected to homepage |

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

### Valid Password for Testing

- `TestPass1!` - meets all requirements (6+ chars, uppercase, lowercase, number, special char)

### Invalid Passwords for Testing

- `abc123` - no uppercase, no special char
- `ABCDEF1!` - no lowercase
- `Abcdef!` - no number
- `Abcdef1` - no special char
- `Ab1!` - too short

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

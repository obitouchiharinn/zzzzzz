# TODO: Fix Google Login Profile Display Issue

## Steps to Complete
- [x] Modify App.jsx to add Supabase auth state management
- [x] Add imports for supabase and assets
- [x] Add user state and useEffect with onAuthStateChange
- [x] Ensure localStorage is set for user_name and user_image with fallbacks
- [x] Dispatch storage event after setting localStorage
- [x] Remove redundant auth listener from Login.jsx
- [ ] Test Google login to verify photo and name display in navbar

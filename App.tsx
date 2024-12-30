// import React from 'react';
// import Navigation from './src/navigation/Navigation'; // Import the Navigation component

// export default function App() {
//   return <Navigation />;
// }

import React from 'react';
import Navigation from './src/navigation/Navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { BookmarksProvider } from './src/contexts/BookmarkContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookmarksProvider>
        <Navigation />
      </BookmarksProvider>
    </AuthProvider>
  );
};

export default App;
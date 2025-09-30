import { useState } from 'react';

export function useCheckUser() {
  const [isLoading] = useState(false);

  // Since we no longer have Auth0, this hook simply returns not loading
  // In a real implementation, you might want to check for some other form of authentication
  
  return { isLoading };
}

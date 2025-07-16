import React from 'react';

const AuthProvider = ({children}: React.PropsWithChildren) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default AuthProvider;
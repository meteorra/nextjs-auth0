import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Highlight from '../components/Highlight';

export default function SSRPage({ user }) {
  const [exportToken, setExportToken] = useState('');
  const [exportApi, setExportApi] = useState('');
  
  useEffect(() => {
    const func = async () => {
      try {
        if (!exportToken) {
          var optionsExport = {
            method: 'POST',
            url: 'https://dev-a5ktl21utephrnaj.us.auth0.com/oauth/token',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: 'eKVK9T1hMYI8PEP88bAayDJKGHDrAyrB',
              client_secret: 'gfE8tLr_Y_F-qLlYXi5FTLgHltC05qSp0d8qpxpqyHhGp_zX0fcw6XkW8HaROy3D',
              audience: 'http://localhost:3001/api/export'
            })
          };
          
          const exportTokenJson = await fetch(optionsExport)
          const expToken = await exportTokenJson.json()
          setExportToken(expToken)
          const exportApiJson = await fetch('http://localhost:3001/api/export', {
            headers: {
              "Authorization": `Bearer ${expToken}`
            }
          })
          const exportApi = await exportApiJson.json()
          setExportApi(exportApi.msg)
        }
      } catch (e) {
        throw e;
      }
    }

    func()
  }, [exportToken, setExportToken])
  
  
  
  return (
    <>
      <div className="mb-5" data-testid="ssr">
        <h1 data-testid="ssr-title">Server-side Rendered Page</h1>
        <div data-testid="ssr-text">
          <p>
            Export M2M token: {exportToken}<br />
            Export API response: {exportApi}<br />
            <br />
            <br />
            You can protect a server-side rendered page by wrapping the <code>getServerSideProps</code> function with{' '}
            <code>withPageAuthRequired</code>. Only logged in users will be able to access it. If the user is logged
            out, they will be redirected to the login page instead.{' '}
          </p>
          <p>
            Protected server-side rendered pages automatically receive a <code>user</code> prop containing the user
            profile.
          </p>
        </div>
      </div>
      <div className="result-block-container" data-testid="ssr-json">
        <div className="result-block">
          <h6 className="muted">User prop</h6>
          <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();

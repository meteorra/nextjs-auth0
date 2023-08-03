import React from 'react';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

import Highlight from '../components/Highlight';

export default function SSRPage({ user, obj }) {
  const { expToken, msg, err } = obj
  return (
    <>
      <div className="mb-5" data-testid="ssr">
        <h1 data-testid="ssr-title">Server-side Rendered Page</h1>
        <div data-testid="ssr-text">
          <p>
            Export M2M token: {expToken}<br />
            Export API response: {msg}<br />
            Err: {err}<br />
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

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const { user } = getSession(req, res)
    let expToken
    let msg
    let err
    try {
      var optionsExport = {
        method: 'POST',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'eKVK9T1hMYI8PEP88bAayDJKGHDrAyrB',
          client_secret: 'gfE8tLr_Y_F-qLlYXi5FTLgHltC05qSp0d8qpxpqyHhGp_zX0fcw6XkW8HaROy3D',
          audience: 'http://localhost:3001/api/export',
        })
      };
      
      const exportTokenJson = await fetch('https://dev-a5ktl21utephrnaj.us.auth0.com/oauth/token', optionsExport)
      expToken = await exportTokenJson.json()
      
      const exportApiJson = await fetch('http://localhost:3001/api/export', {
        headers: {
          "Authorization": `Bearer ${expToken.access_token}`
        }
      })
      const exportApi = await exportApiJson.json()
      msg = exportApi.msg
      console.log(msg)
    } catch (e) {
      err = e
    }
    // Pass data to the page via props
    const obj = { expToken: expToken.access_token, msg, err }
    return { props: { user, obj } }
  }
});

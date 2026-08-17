/* THIS FILE IS PART OF THE PAYLOAD ADMIN SHELL. */
import type { ServerFunctionClient } from 'payload'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import React from 'react'

import { importMap } from './admin/importMap'

import '@payloadcms/next/css'

/**
 * The Payload admin shell — docs/02 §2 puts it in its own route group so it
 * never inherits the marketing layout's header, footer or fonts.
 */
const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

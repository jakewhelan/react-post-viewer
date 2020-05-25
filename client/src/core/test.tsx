const mockXHR = (body, status): Response => {
  return new window.Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-type': 'application/json'
      }
    }
  )
}

export const mockXHR200 = (body: any = {}): Response => mockXHR(body, 200)
export const mockXHR500 = (): Response => window.Response.error()

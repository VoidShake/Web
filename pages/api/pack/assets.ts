import { forwardTokenRequest } from '../../../lib/token'
import handler, { config as handlerConfig } from './[id]/assets'

export default forwardTokenRequest(handler)

export const config = handlerConfig

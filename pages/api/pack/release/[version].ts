import { forwardTokenRequest } from '../../../../lib/token'
import handler from '../[id]/release/[version]'

export default forwardTokenRequest(handler)

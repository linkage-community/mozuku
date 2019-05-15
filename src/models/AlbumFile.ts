import $ from 'cafy'
import Model from './_Model'

type AlbumFileVariantBody = {
  id: number
  score: number
  extension: string
  mime: string
  type: 'image' | 'thumbnail'
  size: number
  url: string
}
interface AlbumFileBody {
  id: number
  name: string
  variants: AlbumFileVariantBody[]
}

export class AlbumFileVariant implements Model<AlbumFileVariantBody> {
  id: number
  type: 'image' | 'thumbnail'
  // #region 無視してもいいかも
  score: number
  extension: string
  // #endregion
  mime: string
  size: number
  url: URL

  private validate(v: any) {
    return $.obj({
      id: $.num,
      // 現時点での対応
      type: $.str.or(['image', 'thumbnail']),
      score: $.num,
      extension: $.string,
      mime: $.str,
      size: $.num,
      url: $.str
    }).throw(v)
  }

  constructor(v: AlbumFileVariantBody) {
    const variant = this.validate(v)
    this.id = variant.id
    this.type = variant.type as 'image' | 'thumbnail'
    this.score = variant.score
    this.extension = variant.extension
    this.mime = variant.mime
    this.size = variant.size
    this.url = new URL(variant.url)
  }

  unpack() {
    const { id, type, score, extension, mime, size } = this
    return {
      id,
      type,
      score,
      extension,
      mime,
      size,
      url: this.url.href
    }
  }
}
export default class AlbumFile implements Model<AlbumFileBody> {
  id: number
  // FIXME: video 実装されるまで Body に type がないので
  type = 'image'
  fileName: string
  variants: AlbumFileVariant[]

  private validate(f: any) {
    return $.obj({
      id: $.num,
      name: $.str,
      variants: $.arr()
    }).throw(f)
  }

  constructor(f: AlbumFileBody) {
    const file = this.validate(f)
    this.id = file.id
    this.fileName = file.name
    this.variants = file.variants.map(v => new AlbumFileVariant(v))
  }

  unpack() {
    return {
      id: this.id,
      name: this.fileName,
      variants: this.variants.map(v => v.unpack())
    }
  }
}

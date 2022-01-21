/* eslint-disable */
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import * as Long from 'long';
import { FileDescriptorProto, GeneratedCodeInfo } from '../../../google/protobuf/descriptor';

/** The version number of protocol compiler. */
export interface Version {
  major: number;
  minor: number;
  patch: number;
  /**
   * A suffix for alpha, beta or rc release, e.g., "alpha-1", "rc2". It should
   * be empty for mainline stable releases.
   */
  suffix: string;
}

/** An encoded CodeGeneratorRequest is written to the plugin's stdin. */
export interface CodeGeneratorRequest {
  /**
   * The .proto files that were explicitly listed on the command-line.  The
   * code generator should generate code only for these files.  Each file's
   * descriptor will be included in proto_file, below.
   */
  fileToGenerate: string[];
  /** The generator parameter passed on the command-line. */
  parameter: string;
  /**
   * FileDescriptorProtos for all files in files_to_generate and everything
   * they import.  The files will appear in topological order, so each file
   * appears before any file that imports it.
   *
   * protoc guarantees that all proto_files will be written after
   * the fields above, even though this is not technically guaranteed by the
   * protobuf wire format.  This theoretically could allow a plugin to stream
   * in the FileDescriptorProtos and handle them one by one rather than read
   * the entire set into memory at once.  However, as of this writing, this
   * is not similarly optimized on protoc's end -- it will store all fields in
   * memory at once before sending them to the plugin.
   *
   * Type names of fields and extensions in the FileDescriptorProto are always
   * fully qualified.
   */
  protoFile: FileDescriptorProto[];
  /** The version number of protocol compiler. */
  compilerVersion: Version | undefined;
}

/** The plugin writes an encoded CodeGeneratorResponse to stdout. */
export interface CodeGeneratorResponse {
  /**
   * Error message.  If non-empty, code generation failed.  The plugin process
   * should exit with status code zero even if it reports an error in this way.
   *
   * This should be used to indicate errors in .proto files which prevent the
   * code generator from generating correct code.  Errors which indicate a
   * problem in protoc itself -- such as the input CodeGeneratorRequest being
   * unparseable -- should be reported by writing a message to stderr and
   * exiting with a non-zero status code.
   */
  error: string;
  /**
   * A bitmask of supported features that the code generator supports.
   * This is a bitwise "or" of values from the Feature enum.
   */
  supportedFeatures: number;
  file: CodeGeneratorResponse_File[];
}

/** Sync with code_generator.h. */
export enum CodeGeneratorResponse_Feature {
  FEATURE_NONE = 0,
  FEATURE_PROTO3_OPTIONAL = 1,
  UNRECOGNIZED = -1,
}

export function codeGeneratorResponse_FeatureFromJSON(object: any): CodeGeneratorResponse_Feature {
  switch (object) {
    case 0:
    case 'FEATURE_NONE':
      return CodeGeneratorResponse_Feature.FEATURE_NONE;
    case 1:
    case 'FEATURE_PROTO3_OPTIONAL':
      return CodeGeneratorResponse_Feature.FEATURE_PROTO3_OPTIONAL;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return CodeGeneratorResponse_Feature.UNRECOGNIZED;
  }
}

export function codeGeneratorResponse_FeatureToJSON(object: CodeGeneratorResponse_Feature): string {
  switch (object) {
    case CodeGeneratorResponse_Feature.FEATURE_NONE:
      return 'FEATURE_NONE';
    case CodeGeneratorResponse_Feature.FEATURE_PROTO3_OPTIONAL:
      return 'FEATURE_PROTO3_OPTIONAL';
    default:
      return 'UNKNOWN';
  }
}

/** Represents a single generated file. */
export interface CodeGeneratorResponse_File {
  /**
   * The file name, relative to the output directory.  The name must not
   * contain "." or ".." components and must be relative, not be absolute (so,
   * the file cannot lie outside the output directory).  "/" must be used as
   * the path separator, not "\".
   *
   * If the name is omitted, the content will be appended to the previous
   * file.  This allows the generator to break large files into small chunks,
   * and allows the generated text to be streamed back to protoc so that large
   * files need not reside completely in memory at one time.  Note that as of
   * this writing protoc does not optimize for this -- it will read the entire
   * CodeGeneratorResponse before writing files to disk.
   */
  name: string;
  /**
   * If non-empty, indicates that the named file should already exist, and the
   * content here is to be inserted into that file at a defined insertion
   * point.  This feature allows a code generator to extend the output
   * produced by another code generator.  The original generator may provide
   * insertion points by placing special annotations in the file that look
   * like:
   *   @@protoc_insertion_point(NAME)
   * The annotation can have arbitrary text before and after it on the line,
   * which allows it to be placed in a comment.  NAME should be replaced with
   * an identifier naming the point -- this is what other generators will use
   * as the insertion_point.  Code inserted at this point will be placed
   * immediately above the line containing the insertion point (thus multiple
   * insertions to the same point will come out in the order they were added).
   * The double-@ is intended to make it unlikely that the generated code
   * could contain things that look like insertion points by accident.
   *
   * For example, the C++ code generator places the following line in the
   * .pb.h files that it generates:
   *   // @@protoc_insertion_point(namespace_scope)
   * This line appears within the scope of the file's package namespace, but
   * outside of any particular class.  Another plugin can then specify the
   * insertion_point "namespace_scope" to generate additional classes or
   * other declarations that should be placed in this scope.
   *
   * Note that if the line containing the insertion point begins with
   * whitespace, the same whitespace will be added to every line of the
   * inserted text.  This is useful for languages like Python, where
   * indentation matters.  In these languages, the insertion point comment
   * should be indented the same amount as any inserted code will need to be
   * in order to work correctly in that context.
   *
   * The code generator that generates the initial file and the one which
   * inserts into it must both run as part of a single invocation of protoc.
   * Code generators are executed in the order in which they appear on the
   * command line.
   *
   * If |insertion_point| is present, |name| must also be present.
   */
  insertionPoint: string;
  /** The file contents. */
  content: string;
  /**
   * Information describing the file content being inserted. If an insertion
   * point is used, this information will be appropriately offset and inserted
   * into the code generation metadata for the generated files.
   */
  generatedCodeInfo: GeneratedCodeInfo | undefined;
}

function createBaseVersion(): Version {
  return { major: 0, minor: 0, patch: 0, suffix: '' };
}

export const Version = {
  encode(message: Version, writer: Writer = Writer.create()): Writer {
    if (message.major !== 0) {
      writer.uint32(8).int32(message.major);
    }
    if (message.minor !== 0) {
      writer.uint32(16).int32(message.minor);
    }
    if (message.patch !== 0) {
      writer.uint32(24).int32(message.patch);
    }
    if (message.suffix !== '') {
      writer.uint32(34).string(message.suffix);
    }
    if ('_unknownFields' in message) {
      for (const key of Object.keys(message['_unknownFields'])) {
        const values = message['_unknownFields'][key] as Uint8Array[];
        for (const value of values) {
          writer.uint32(parseInt(key, 10));
          (writer as any)['_push'](
            (val: Uint8Array, buf: Buffer, pos: number) => buf.set(val, pos),
            value.length,
            value
          );
        }
      }
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Version {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseVersion()) as Version;
    (message as any)._unknownFields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.major = reader.int32();
          break;
        case 2:
          message.minor = reader.int32();
          break;
        case 3:
          message.patch = reader.int32();
          break;
        case 4:
          message.suffix = reader.string();
          break;
        default:
          const startPos = reader.pos;
          reader.skipType(tag & 7);
          (message as any)._unknownFields[tag] = [
            ...((message as any)._unknownFields[tag] || []),
            reader.buf.slice(startPos, reader.pos),
          ];
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Version {
    return {
      major: isSet(object.major) ? Number(object.major) : 0,
      minor: isSet(object.minor) ? Number(object.minor) : 0,
      patch: isSet(object.patch) ? Number(object.patch) : 0,
      suffix: isSet(object.suffix) ? String(object.suffix) : '',
    };
  },

  toJSON(message: Version): unknown {
    const obj: any = {};
    message.major !== undefined && (obj.major = Math.round(message.major));
    message.minor !== undefined && (obj.minor = Math.round(message.minor));
    message.patch !== undefined && (obj.patch = Math.round(message.patch));
    message.suffix !== undefined && (obj.suffix = message.suffix);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Version>, I>>(object: I): Version {
    const message = Object.create(createBaseVersion()) as Version;
    message.major = object.major ?? 0;
    message.minor = object.minor ?? 0;
    message.patch = object.patch ?? 0;
    message.suffix = object.suffix ?? '';
    return message;
  },
};

function createBaseCodeGeneratorRequest(): CodeGeneratorRequest {
  return { fileToGenerate: [], parameter: '', protoFile: [], compilerVersion: undefined };
}

export const CodeGeneratorRequest = {
  encode(message: CodeGeneratorRequest, writer: Writer = Writer.create()): Writer {
    for (const v of message.fileToGenerate) {
      writer.uint32(10).string(v!);
    }
    if (message.parameter !== '') {
      writer.uint32(18).string(message.parameter);
    }
    for (const v of message.protoFile) {
      FileDescriptorProto.encode(v!, writer.uint32(122).fork()).ldelim();
    }
    if (message.compilerVersion !== undefined) {
      Version.encode(message.compilerVersion, writer.uint32(26).fork()).ldelim();
    }
    if ('_unknownFields' in message) {
      for (const key of Object.keys(message['_unknownFields'])) {
        const values = message['_unknownFields'][key] as Uint8Array[];
        for (const value of values) {
          writer.uint32(parseInt(key, 10));
          (writer as any)['_push'](
            (val: Uint8Array, buf: Buffer, pos: number) => buf.set(val, pos),
            value.length,
            value
          );
        }
      }
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CodeGeneratorRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCodeGeneratorRequest()) as CodeGeneratorRequest;
    (message as any)._unknownFields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fileToGenerate.push(reader.string());
          break;
        case 2:
          message.parameter = reader.string();
          break;
        case 15:
          message.protoFile.push(FileDescriptorProto.decode(reader, reader.uint32()));
          break;
        case 3:
          message.compilerVersion = Version.decode(reader, reader.uint32());
          break;
        default:
          const startPos = reader.pos;
          reader.skipType(tag & 7);
          (message as any)._unknownFields[tag] = [
            ...((message as any)._unknownFields[tag] || []),
            reader.buf.slice(startPos, reader.pos),
          ];
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CodeGeneratorRequest {
    return {
      fileToGenerate: Array.isArray(object?.fileToGenerate) ? object.fileToGenerate.map((e: any) => String(e)) : [],
      parameter: isSet(object.parameter) ? String(object.parameter) : '',
      protoFile: Array.isArray(object?.protoFile)
        ? object.protoFile.map((e: any) => FileDescriptorProto.fromJSON(e))
        : [],
      compilerVersion: isSet(object.compilerVersion) ? Version.fromJSON(object.compilerVersion) : undefined,
    };
  },

  toJSON(message: CodeGeneratorRequest): unknown {
    const obj: any = {};
    if (message.fileToGenerate) {
      obj.fileToGenerate = message.fileToGenerate.map((e) => e);
    } else {
      obj.fileToGenerate = [];
    }
    message.parameter !== undefined && (obj.parameter = message.parameter);
    if (message.protoFile) {
      obj.protoFile = message.protoFile.map((e) => (e ? FileDescriptorProto.toJSON(e) : undefined));
    } else {
      obj.protoFile = [];
    }
    message.compilerVersion !== undefined &&
      (obj.compilerVersion = message.compilerVersion ? Version.toJSON(message.compilerVersion) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CodeGeneratorRequest>, I>>(object: I): CodeGeneratorRequest {
    const message = Object.create(createBaseCodeGeneratorRequest()) as CodeGeneratorRequest;
    message.fileToGenerate = object.fileToGenerate?.map((e) => e) || [];
    message.parameter = object.parameter ?? '';
    message.protoFile = object.protoFile?.map((e) => FileDescriptorProto.fromPartial(e)) || [];
    message.compilerVersion =
      object.compilerVersion !== undefined && object.compilerVersion !== null
        ? Version.fromPartial(object.compilerVersion)
        : undefined;
    return message;
  },
};

function createBaseCodeGeneratorResponse(): CodeGeneratorResponse {
  return { error: '', supportedFeatures: 0, file: [] };
}

export const CodeGeneratorResponse = {
  encode(message: CodeGeneratorResponse, writer: Writer = Writer.create()): Writer {
    if (message.error !== '') {
      writer.uint32(10).string(message.error);
    }
    if (message.supportedFeatures !== 0) {
      writer.uint32(16).uint64(message.supportedFeatures);
    }
    for (const v of message.file) {
      CodeGeneratorResponse_File.encode(v!, writer.uint32(122).fork()).ldelim();
    }
    if ('_unknownFields' in message) {
      for (const key of Object.keys(message['_unknownFields'])) {
        const values = message['_unknownFields'][key] as Uint8Array[];
        for (const value of values) {
          writer.uint32(parseInt(key, 10));
          (writer as any)['_push'](
            (val: Uint8Array, buf: Buffer, pos: number) => buf.set(val, pos),
            value.length,
            value
          );
        }
      }
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CodeGeneratorResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCodeGeneratorResponse()) as CodeGeneratorResponse;
    (message as any)._unknownFields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.error = reader.string();
          break;
        case 2:
          message.supportedFeatures = longToNumber(reader.uint64() as Long);
          break;
        case 15:
          message.file.push(CodeGeneratorResponse_File.decode(reader, reader.uint32()));
          break;
        default:
          const startPos = reader.pos;
          reader.skipType(tag & 7);
          (message as any)._unknownFields[tag] = [
            ...((message as any)._unknownFields[tag] || []),
            reader.buf.slice(startPos, reader.pos),
          ];
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CodeGeneratorResponse {
    return {
      error: isSet(object.error) ? String(object.error) : '',
      supportedFeatures: isSet(object.supportedFeatures) ? Number(object.supportedFeatures) : 0,
      file: Array.isArray(object?.file) ? object.file.map((e: any) => CodeGeneratorResponse_File.fromJSON(e)) : [],
    };
  },

  toJSON(message: CodeGeneratorResponse): unknown {
    const obj: any = {};
    message.error !== undefined && (obj.error = message.error);
    message.supportedFeatures !== undefined && (obj.supportedFeatures = Math.round(message.supportedFeatures));
    if (message.file) {
      obj.file = message.file.map((e) => (e ? CodeGeneratorResponse_File.toJSON(e) : undefined));
    } else {
      obj.file = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CodeGeneratorResponse>, I>>(object: I): CodeGeneratorResponse {
    const message = Object.create(createBaseCodeGeneratorResponse()) as CodeGeneratorResponse;
    message.error = object.error ?? '';
    message.supportedFeatures = object.supportedFeatures ?? 0;
    message.file = object.file?.map((e) => CodeGeneratorResponse_File.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCodeGeneratorResponse_File(): CodeGeneratorResponse_File {
  return { name: '', insertionPoint: '', content: '', generatedCodeInfo: undefined };
}

export const CodeGeneratorResponse_File = {
  encode(message: CodeGeneratorResponse_File, writer: Writer = Writer.create()): Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.insertionPoint !== '') {
      writer.uint32(18).string(message.insertionPoint);
    }
    if (message.content !== '') {
      writer.uint32(122).string(message.content);
    }
    if (message.generatedCodeInfo !== undefined) {
      GeneratedCodeInfo.encode(message.generatedCodeInfo, writer.uint32(130).fork()).ldelim();
    }
    if ('_unknownFields' in message) {
      for (const key of Object.keys(message['_unknownFields'])) {
        const values = message['_unknownFields'][key] as Uint8Array[];
        for (const value of values) {
          writer.uint32(parseInt(key, 10));
          (writer as any)['_push'](
            (val: Uint8Array, buf: Buffer, pos: number) => buf.set(val, pos),
            value.length,
            value
          );
        }
      }
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CodeGeneratorResponse_File {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCodeGeneratorResponse_File()) as CodeGeneratorResponse_File;
    (message as any)._unknownFields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.insertionPoint = reader.string();
          break;
        case 15:
          message.content = reader.string();
          break;
        case 16:
          message.generatedCodeInfo = GeneratedCodeInfo.decode(reader, reader.uint32());
          break;
        default:
          const startPos = reader.pos;
          reader.skipType(tag & 7);
          (message as any)._unknownFields[tag] = [
            ...((message as any)._unknownFields[tag] || []),
            reader.buf.slice(startPos, reader.pos),
          ];
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CodeGeneratorResponse_File {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      insertionPoint: isSet(object.insertionPoint) ? String(object.insertionPoint) : '',
      content: isSet(object.content) ? String(object.content) : '',
      generatedCodeInfo: isSet(object.generatedCodeInfo)
        ? GeneratedCodeInfo.fromJSON(object.generatedCodeInfo)
        : undefined,
    };
  },

  toJSON(message: CodeGeneratorResponse_File): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.insertionPoint !== undefined && (obj.insertionPoint = message.insertionPoint);
    message.content !== undefined && (obj.content = message.content);
    message.generatedCodeInfo !== undefined &&
      (obj.generatedCodeInfo = message.generatedCodeInfo
        ? GeneratedCodeInfo.toJSON(message.generatedCodeInfo)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CodeGeneratorResponse_File>, I>>(object: I): CodeGeneratorResponse_File {
    const message = Object.create(createBaseCodeGeneratorResponse_File()) as CodeGeneratorResponse_File;
    message.name = object.name ?? '';
    message.insertionPoint = object.insertionPoint ?? '';
    message.content = object.content ?? '';
    message.generatedCodeInfo =
      object.generatedCodeInfo !== undefined && object.generatedCodeInfo !== null
        ? GeneratedCodeInfo.fromPartial(object.generatedCodeInfo)
        : undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw 'Unable to locate global object';
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
  }
  return long.toNumber();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

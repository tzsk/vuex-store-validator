import r from"ajv";export default async(o,e)=>{const a=new r({jsonPointers:!0,$data:!0}).compile(o||{});if(await a(e),a.errors)throw new Error(a.errors.map(r=>r.message).join(", "))};
//# sourceMappingURL=ajv-70e862a1.js.map

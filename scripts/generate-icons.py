# Dependency-free rasterization of the game's geometric four-block logo.
import struct,zlib
from pathlib import Path
for size,name in [(192,'icon-192.png'),(512,'icon-512.png'),(180,'apple-touch-icon.png')]:
 rows=[]
 for y in range(size):
  row=bytearray()
  for x in range(size):
   color=(16,19,29)
   for i,(a,b) in enumerate([(0.24,0.24),(0.52,0.24),(0.24,0.52),(0.52,0.52)]):
    left,top,width,r=a*size,b*size,.24*size,.035*size
    if left<=x<=left+width and top<=y<=top+width:
     cx=max(left+r,min(left+width-r,x));cy=max(top+r,min(top+width-r,y))
     if (x-cx)**2+(y-cy)**2<=r*r:color=(67,85,53) if i==0 else (183,245,123)
   row.extend(color)
  rows.append(b'\x00'+row)
 def chunk(t,data):return struct.pack('!I',len(data))+t+data+struct.pack('!I',zlib.crc32(t+data)&0xffffffff)
 png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows)))+chunk(b'IEND',b'')
 Path('public',name).write_bytes(png)

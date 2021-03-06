# yaml-merger

Merge 2 yaml files and outputs to console or given output file.

## Installation

```bash
$ npm install -g yaml-merger
```

## Usage

```bash
$ yaml-merger -h

  Merge 2 yaml files.

  Usage
    $ yaml-merger -i <fileA.yaml> -i <fileB.yaml> [-o output.yaml]

  Options
    -i, --input  Input files, define 2
    -o, --output Output file, if omited outputs to console
    --mergePath  Change root path in first file to be merged in
    -v           Verbose console logging
    -h, --help   Shows this help
```

## Examples

`testA.yaml` file:

```yaml
keyA: aValue
keyDeep:
  a: deepA
  b: deepB
keyArray:
- itemOne
- itemTwo
- 3
```

`testB.yaml` file:

```yaml
keyA: aValue
keyDeep:
  a: deepX
keyArray:
- itemFour
```


```bash
$ yaml-merger fileA.yaml fileB.yaml
keyA: aValue
keyDeep:
  a: deepX
  b: deepB
keyArray:
  - itemOne
  - itemTwo
  - 3
  - itemFour
```
